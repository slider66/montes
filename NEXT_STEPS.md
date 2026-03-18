# Próximos Pasos — Montes Web App

> Hoja de ruta de implementación ordenada por fases. Cada fase es desplegable de forma independiente.

---

## FASE 0 — Setup del Proyecto (30 min)

### 0.1 Inicializar Next.js

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir=no --import-alias="@/*"
```

> Reemplaza los archivos generados con los del boilerplate de este repo.

### 0.2 Instalar dependencias

```bash
npm install @vercel/kv @vercel/edge-config @vercel/blob @vercel/analytics @vercel/speed-insights framer-motion resend date-fns date-fns-tz nanoid zod clsx tailwind-merge
```

### 0.3 Conectar a Vercel

```bash
npm i -g vercel
vercel link          # Vincula el proyecto a tu cuenta Vercel
vercel env pull      # Descarga las variables de entorno a .env.local
```

---

## FASE 1 — Infraestructura Vercel (1-2h)

### 1.1 Vercel KV (Redis)
1. En el Dashboard de Vercel → tu proyecto → **Storage** → **Create KV Database**
2. Nombre: `montes-kv` · Región: `fra1` (Frankfurt, más cercana a España)
3. Hacer click en **Connect** → se añaden las env vars automáticamente
4. Verificar con: `vercel env pull && node -e "require('@vercel/kv').kv.ping().then(console.log)"`

### 1.2 Vercel Edge Config
1. Dashboard → **Storage** → **Create Edge Config**
2. Nombre: `montes-config`
3. Pegar el JSON de sabores del archivo `ARCHITECTURE.md` (sección 5)
4. Conectar al proyecto → env var `EDGE_CONFIG` se añade sola

### 1.3 Vercel Blob
1. Dashboard → **Storage** → **Create Blob Store**
2. Nombre: `montes-fotos`
3. Conectar → env var `BLOB_READ_WRITE_TOKEN` disponible
4. Subir las fotos de cada tortilla desde la UI o con el SDK:
   ```ts
   import { put } from '@vercel/blob'
   const { url } = await put('tortillas/clasica.jpg', file, { access: 'public' })
   ```

---

## FASE 2 — Lógica Core (2-3h)

### 2.1 Formulario de Reserva (`/reservar`)

Crear `app/reservar/page.tsx` con un formulario multi-step:
- **Step 1**: Selector de sabor (si no viene por query param)
- **Step 2**: Selector de fecha (CalendarPicker con `getDiasDisponibles()`)
- **Step 3**: Cantidad (1-4) y datos del cliente
- **Step 4**: Confirmación visual

Componentes necesarios:
- [ ] `components/ui/ReservaForm.tsx` → formulario controlado con estado local
- [ ] `components/ui/CalendarPicker.tsx` → grid de 14 días con disponibilidad
- [ ] `components/ui/QuantitySelector.tsx` → stepper +/-

### 2.2 Página de Confirmación (`/reservar/confirmacion`)

Mostrar resumen de la reserva con:
- Número de reserva (`res_xxxx`)
- Fecha y hora de recogida
- Botón para añadir al calendario (ICS download)
- CTA para compartir en WhatsApp

### 2.3 Seed de Stock Inicial

Crear `scripts/seed-stock.ts` para inicializar el KV con stock para los próximos 14 días:

```ts
import { kv } from '@vercel/kv'
import { getDiasDisponibles } from '../lib/horario'

const SABORES = ['clasica', 'jamon-queso', 'casica con cebolla', 'morcilla',
                  'chorizo', 'vegana', 'bacalao', 'setas']
const STOCK_DIARIO = 20

async function seed() {
  const dias = getDiasDisponibles(14)
  const pipeline = kv.pipeline()

  for (const dia of dias) {
    for (const sabor of SABORES) {
      pipeline.set(`stock:${dia}:${sabor}`, STOCK_DIARIO, { nx: true })
    }
  }

  await pipeline.exec()
  console.log(`Stock inicializado: ${dias.length} días × ${SABORES.length} sabores`)
}

seed()
```

```bash
npx tsx scripts/seed-stock.ts
```

---

## FASE 3 — Notificaciones por Email (1h)

### 3.1 Cuenta Resend

1. Crear cuenta en [resend.com](https://resend.com)
2. Verificar dominio (si tienes uno) o usar el sandbox para pruebas
3. Añadir `RESEND_API_KEY` a Vercel env vars

### 3.2 Template de Confirmación

Crear `emails/ConfirmacionReserva.tsx` con React Email:

```bash
npm install react-email @react-email/components
```

```tsx
// emails/ConfirmacionReserva.tsx
import { Html, Heading, Text, Section } from '@react-email/components'

export function ConfirmacionReserva({ reserva }: { reserva: Reserva }) {
  return (
    <Html>
      <Heading>¡Tu tortilla está reservada! 🥚</Heading>
      <Section>
        <Text>Hola {reserva.cliente.nombre},</Text>
        <Text>
          Tu reserva de <strong>{reserva.cantidad} tortilla(s) {reserva.sabor}</strong>
          para el <strong>{reserva.fecha}</strong> está confirmada.
        </Text>
        <Text>Recuerda pasar a recogerla de 07:00 a 14:00.</Text>
        <Text>Tu código de reserva: <strong>{reserva.id}</strong></Text>
      </Section>
    </Html>
  )
}
```

### 3.3 Integrar en la API

Añadir al final de `lib/reservas.ts` tras `guardarReserva()`:

```ts
import { Resend } from 'resend'
import { ConfirmacionReserva } from '@/emails/ConfirmacionReserva'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'Montes <reservas@tudominio.com>',
  to: reserva.cliente.email,
  subject: `Reserva confirmada — ${reserva.sabor} el ${reserva.fecha}`,
  react: ConfirmacionReserva({ reserva }),
})
```

---

## FASE 4 — Panel de Administración (2-3h)

### 4.1 Autenticación Admin

Usar NextAuth.js con email magic link (sin contraseña):

```bash
npm install next-auth@beta
```

```ts
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import Resend from 'next-auth/providers/resend'

export const { handlers, auth } = NextAuth({
  providers: [Resend({ from: 'reservas@tudominio.com' })],
  callbacks: {
    signIn: ({ user }) => user.email === process.env.ADMIN_EMAIL,
  },
})
```

### 4.2 Dashboard de Reservas

Crear `app/admin/page.tsx`:
- Tabla de reservas del día con estado
- Filtro por sabor
- Botón cancelar reserva (con devolución automática de stock en KV)
- Totales por sabor (cuántas vendidas vs stock)

### 4.3 Gestión de Stock Manual

Crear `app/admin/stock/page.tsx`:
- Form para ajustar el stock de cualquier sabor/fecha
- Útil para casos excepcionales (tortilla rota, merma, etc.)

---

## FASE 5 — Optimizaciones de Performance (1-2h)

### 5.1 Polling de Stock en Cliente

En `TortillaCard.tsx` añadir actualización de stock sin websockets:

```tsx
'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Refresca el Server Component cada 30 segundos
useEffect(() => {
  const interval = setInterval(() => router.refresh(), 30_000)
  return () => clearInterval(interval)
}, [router])
```

### 5.2 Optimistic UI en la Reserva

Al hacer submit del formulario, mostrar inmediatamente la confirmación mientras se procesa la API. Usar `useOptimistic` de React 19.

### 5.3 Imágenes de Tortillas

1. Fotografiar cada tortilla con buena luz (o usar placeholders generados con IA)
2. Subir a Vercel Blob con script
3. Actualizar Edge Config con las URLs
4. Usar `next/image` con `sizes` correcto para mobile-first:
   ```tsx
   <Image src={sabor.imagenUrl} sizes="(max-width: 640px) 56px, 56px" ... />
   ```

---

## FASE 6 — Pagos con Stripe (opcional, 2-3h)

> Solo si se quiere requerir señal para confirmar la reserva y reducir no-shows.

```bash
npm install stripe @stripe/stripe-js
```

Flujo:
1. Al crear reserva → crear `PaymentIntent` en Stripe (importe = 1€ señal o precio total)
2. Redirigir al checkout de Stripe
3. Webhook `payment_intent.succeeded` → confirmar reserva en KV y enviar email
4. Si no se paga en 15 min → liberar stock automáticamente

```ts
// lib/stripe.ts
import Stripe from 'stripe'
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})
```

---

## FASE 7 — Despliegue y Monitorización

### 7.1 Despliegue Inicial

```bash
vercel --prod
```

### 7.2 Dominio Personalizado

1. Vercel Dashboard → **Domains** → añadir `tortillasmontes.es` (o similar)
2. Actualizar DNS en tu registrador

### 7.3 Alertas de Stock en Cero

Usar Vercel Cron Jobs para enviar un email al admin si algún sabor llega a 0:

```ts
// app/api/cron/check-stock/route.ts
export const runtime = 'edge'

// Configurar en vercel.json:
// { "crons": [{ "path": "/api/cron/check-stock", "schedule": "0 */2 * * *" }] }
```

### 7.4 Monitorización

- **Vercel Analytics**: Core Web Vitals automáticos en producción
- **Speed Insights**: LCP, FID, CLS por página
- Meta objetivo: **LCP < 1.2s** en mobile 4G

---

## Checklist Final Antes de Lanzar

- [ ] Stock inicializado en KV para los próximos 14 días
- [ ] Edge Config cargado con los 8 sabores y precios definitivos
- [ ] Fotos de tortillas subidas a Vercel Blob
- [ ] Email de confirmación probado en sandbox Resend
- [ ] Panel admin accesible y probado
- [ ] Probado en móvil real (iPhone + Android)
- [ ] LCP < 1.2s verificado con PageSpeed Insights
- [ ] Dominio propio configurado con HTTPS
- [ ] Variables de entorno de producción revisadas

---

## Estimación Total de Trabajo

| Fase | Tiempo estimado |
|---|---|
| 0 — Setup | 30 min |
| 1 — Infraestructura Vercel | 1-2h |
| 2 — Lógica Core | 2-3h |
| 3 — Emails | 1h |
| 4 — Admin panel | 2-3h |
| 5 — Performance | 1-2h |
| 6 — Stripe (opcional) | 2-3h |
| 7 — Despliegue | 30 min |
| **Total (sin Stripe)** | **~10-14h** |
