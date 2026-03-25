# Café & Tortilla Montes

Web app de reservas y encargos para **Café & Tortilla Montes** — San Agustín de Guadalix. Stock limitado de tortillas artesanales, sistema de reserva online, catálogo visual y sistema de encargos grandes para eventos.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 App Router + React 19 |
| Estilos | Tailwind CSS v4 + paleta tortilla |
| Animaciones | Framer Motion 11 |
| Stock en tiempo real | Vercel KV (Redis) |
| Configuración dinámica | Vercel Edge Config |
| Almacenamiento de fotos | Vercel Blob |
| Emails | Resend |
| Deploy | Vercel (rama `main`, auto-deploy) |

---

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Descargar variables de entorno desde Vercel
vercel env pull

# Desarrollo (usar CMD, no PowerShell)
npm run dev
```

> En equipos con PowerShell bloqueado por GPO, usar **Command Prompt (CMD)**.

---

## Variables de entorno

Todas se configuran en Vercel y se descargan con `vercel env pull`:

```env
# Vercel KV (Redis) — stock de tortillas
KV_REST_API_URL=
KV_REST_API_TOKEN=

# Vercel Edge Config — sabores, precios, horario
EDGE_CONFIG=

# Vercel Blob — fotos de las tortillas
BLOB_READ_WRITE_TOKEN=

# Resend — emails de confirmación
RESEND_API_KEY=

# Email del administrador (recibe notificación de cada encargo)
ADMIN_EMAIL=hola@cafemontes.es

# Email remitente para los envíos
FROM_EMAIL=encargos@cafemontes.es
```

Para desarrollo local sin Vercel:

```env
# .env.local
FEATURE_ENCARGOS=true   # activa la sección de encargos en local
```

---

## Infraestructura Vercel

### 1. Vercel KV (Redis)

1. Dashboard Vercel → **Storage** → **Create KV Database**
2. Nombre: `montes-kv` · Región: `fra1` (Frankfurt)
3. Click en **Connect** al proyecto — las env vars se añaden solas
4. Verificar: `vercel env pull && node -e "require('@vercel/kv').kv.ping().then(console.log)"`

### 2. Vercel Edge Config

1. Dashboard → **Storage** → **Create Edge Config** → nombre `montes-config`
2. Conectar al proyecto (se añade `EDGE_CONFIG` automáticamente)
3. Pegar el JSON de configuración (ver sección siguiente)

### 3. Vercel Blob

1. Dashboard → **Storage** → **Create Blob Store** → nombre `montes-fotos`
2. Conectar al proyecto (`BLOB_READ_WRITE_TOKEN` disponible)
3. Subir fotos de tortillas con la UI o con el SDK

---

## Edge Config — JSON de configuración

Pegar en el editor de Edge Config del dashboard:

```json
{
  "featureEncargos": false,
  "horario": {
    "apertura": "07:00",
    "cierre": "14:00",
    "zona": "Europe/Madrid"
  },
  "stockDiario": 8,
  "diasReservaVentana": 7,
  "diasReservaCupon": 14,
  "sabores": [
    {
      "id": "clasica-con",
      "nombre": "Clásica con Cebolla",
      "descripcion": "La receta de siempre. Huevo, patata y cebolla pochada a fuego lento. Jugosa por dentro, dorada por fuera.",
      "emoji": "🥚",
      "precio": 8.00,
      "precioGrande": 14.50,
      "nota": "6 huevos · 12 huevos disponible",
      "activo": true,
      "imagenUrl": "/tortillas/clasica-abierta.webp"
    },
    {
      "id": "clasica-sin",
      "nombre": "Clásica sin Cebolla",
      "descripcion": "La pureza del huevo y la patata. Para los que prefieren el sabor más directo y tradicional.",
      "emoji": "🍳",
      "precio": 8.00,
      "precioGrande": 14.50,
      "nota": "6 huevos · 12 huevos disponible",
      "activo": true,
      "imagenUrl": "/tortillas/clasica-sin-cebolla.webp"
    },
    {
      "id": "jamon-queso",
      "nombre": "Jamón York y Queso",
      "descripcion": "Tortilla de patata rellena con jamón york y queso fundido en el centro.",
      "emoji": "🧀",
      "precio": 10.00,
      "precioGrande": 18.50,
      "nota": "Rellena · 6 huevos · 12 huevos disponible",
      "activo": true,
      "imagenUrl": "/tortillas/jamon-queso.webp"
    },
    {
      "id": "chorizo",
      "nombre": "Chorizo",
      "descripcion": "Rellena de chorizo casero. Sabor intenso y tradicional en cada corte.",
      "emoji": "🌶️",
      "precio": 10.00,
      "precioGrande": 18.50,
      "nota": "Rellena · 6 huevos · 12 huevos disponible",
      "activo": true,
      "imagenUrl": "/tortillas/chorizo.webp"
    },
    {
      "id": "morcilla",
      "nombre": "Morcilla",
      "descripcion": "Tortilla rellena de morcilla. Sabor profundo y contundente.",
      "emoji": "🫙",
      "precio": 10.00,
      "precioGrande": 18.50,
      "nota": "Rellena · 6 huevos · 12 huevos disponible",
      "activo": true,
      "imagenUrl": "/tortillas/morcilla.webp"
    },
    {
      "id": "atun",
      "nombre": "Atún",
      "descripcion": "Rellena de atún en aceite de oliva. Suave, jugosa y con todo el sabor del mar.",
      "emoji": "🐟",
      "precio": 10.00,
      "precioGrande": 18.50,
      "nota": "Rellena · 6 huevos · 12 huevos disponible",
      "activo": true,
      "imagenUrl": "/tortillas/atun.webp"
    }
  ]
}
```

### Campos del JSON

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `featureEncargos` | `boolean` | `true` activa la sección de encargos sin redeploy |
| `horario.apertura` | `"HH:MM"` | Hora de apertura para reservas |
| `horario.cierre` | `"HH:MM"` | Hora de cierre para reservas |
| `stockDiario` | `number` | Tortillas disponibles por día (actualmente 8) |
| `diasReservaVentana` | `number` | Días hacia el futuro que el cliente puede reservar |
| `sabores[].activo` | `boolean` | `false` oculta el sabor del catálogo |
| `sabores[].esTemporada` | `boolean` | `true` = solo disponible en local, no reservable |
| `sabores[].imagenUrl` | `string` | Ruta en `/public/` o URL de Vercel Blob |

---

## Feature Flags

### Sistema de encargos (`featureEncargos`)

Controla toda la Fase 2 (encargos grandes). Cuando está `false`:
- El CTA de encargos **no aparece** en la homepage
- El link en el footer **no aparece**
- `/encargo` **redirige automáticamente a `/`**
- La API `/api/encargos` existe pero nadie la llama

**Activar en producción** (sin redeploy, activo en ~5 segundos):
```
Dashboard Vercel → Storage → Edge Config → Editar JSON
Cambiar: "featureEncargos": true
```

**Demo al cliente** (solo para esa sesión de navegador):
```
Dashboard Vercel → Storage → Edge Config → Editar JSON
Cambiar: "featureEncargos": false   ← producción sigue oculto
```
Luego activar en el navegador el `DemoSwitch` (botón visible solo en sesiones con cookie `demo_encargos=1`).

---

## Sistema de encargos

Flujo completo del wizard en `/encargo`:

```
Stage 0 — Catálogo
  ├── Desktop: catálogo izquierda + resumen sticky derecha
  └── Mobile: catálogo + cajón flotante con total

Stage 1 — Resumen
  └── Revisión del pedido antes de introducir datos

Stage 2 — Datos
  ├── Nombre, email, teléfono
  ├── Fecha de recogida (hoy+2 hasta hoy+30)
  └── Hora de recogida: 08:00 · 09:00 · 10:00 · 11:00 · 12:00 · 13:00 · 13:30

Stage 3 — Confirmación
  ├── ID de encargo (ej: enc_xKp3mN8qYz)
  ├── Tabla resumen con precios
  ├── Botón WhatsApp (mensaje pre-rellenado con ID y fecha)
  └── Descarga .ics para añadir al calendario
```

### Reglas de negocio

| Regla | Valor |
|-------|-------|
| Antelación mínima | 48 horas (validado en servidor con zona Europe/Madrid) |
| Antelación máxima | 30 días |
| Tamaños | Mediana (6 huevos) · Grande (12 huevos) |
| Pago | En el local el día de la recogida |
| Total | Siempre calculado en servidor, no se confía en el cliente |

### Emails automáticos

Al confirmar un encargo se envían dos emails vía Resend (fire & forget):

**Al administrador** — `ADMIN_EMAIL`
- Subject: `Nuevo encargo — [Nombre] · [Fecha] [Hora]`
- Tabla completa del pedido, teléfono clickable, ID encargo

**Al cliente**
- Subject: `¡Encargo confirmado! — Recogida el [Fecha]`
- Resumen del pedido, dirección de recogida, teléfono del local

---

## Productos de temporada

### Torrijas (automático)

`lib/temporada.ts` calcula la fecha de Pascua con el **algoritmo Gregoriano Anónimo** y activa la card de torrijas automáticamente. No requiere intervención manual.

| Año | Pascua | Disponibles desde | Hasta |
|-----|--------|-------------------|-------|
| 2025 | 20 abr | 21 mar | 27 abr |
| 2026 | 5 abr | 6 mar | 12 abr |
| 2027 | 28 mar | 26 feb | 4 abr |

Las torrijas tienen `esTemporada: true` — aparecen en el catálogo de la homepage pero **no son encargables**.

---

## Imágenes de tortillas

Todas en `/public/tortillas/` en formato **WebP**.

Para añadir o actualizar una imagen:

```bash
# 1. Convertir PNG a WebP (instalar sharp temporalmente)
npm install sharp
node -e "require('sharp')('public/tortillas/nueva.png').webp({quality:87}).toFile('public/tortillas/nueva.webp').then(console.log)"
npm uninstall sharp
pnpm install   # restaurar lockfile de pnpm para Vercel

# 2. Actualizar imagenUrl en Edge Config o en SABORES_DEMO de app/page.tsx
```

> **Importante:** no dejar `sharp` en `package.json`. Vercel usa pnpm y el lockfile se desincroniza.

---

## Estructura del proyecto

```
├── app/
│   ├── page.tsx                      # Home: Hero 3D + calendario + catálogo + encargos CTA
│   ├── encargo/page.tsx              # Wizard de encargos (protegido por featureEncargos)
│   ├── api/
│   │   ├── reservas/route.ts         # POST — crear reserva de mostrador
│   │   ├── encargos/route.ts         # POST — crear encargo grande
│   │   └── stock/[sabor]/route.ts    # GET — stock actual de un sabor
│   └── globals.css                   # Design tokens + base styles
│
├── components/
│   ├── ui/
│   │   ├── Hero3D.tsx                # Hero con escena Three.js
│   │   ├── BentoCatalogo.tsx         # Grid bento con imágenes WebP
│   │   ├── CalendarioSemana.tsx      # Selector de fecha (7 días + stock)
│   │   ├── MarqueeTicker.tsx         # Ticker animado de productos
│   │   ├── CartaSection.tsx          # Carta completa del café
│   │   ├── DemoSwitch.tsx            # Switch para demo al cliente
│   │   └── Footer.tsx
│   └── encargo/
│       ├── EncargoWizard.tsx         # Shell del wizard (useReducer, 4 stages)
│       ├── CatalogoPedido.tsx        # Grid de tortillas con steppers
│       ├── TortillaLineaCard.tsx     # Card por sabor: mediana + grande
│       ├── ResumenEncargo.tsx        # Sidebar/página de resumen
│       ├── CartDrawerMobile.tsx      # Cajón inferior móvil (Framer Motion)
│       ├── StepDatos.tsx             # Formulario + pickers + llamada API
│       ├── FormDatosContacto.tsx     # Campos nombre/email/teléfono/notas
│       ├── PickerFechaEncargo.tsx    # Selector de fecha (hoy+2 a hoy+30)
│       ├── PickerHoraEncargo.tsx     # Selector de hora (slots fijos)
│       ├── ConfirmacionEncargo.tsx   # Pantalla final + WhatsApp + .ics
│       └── EncargosCTA.tsx           # Banner en homepage
│
├── lib/
│   ├── types.ts                      # Todos los tipos: Sabor, Reserva, Encargo…
│   ├── kv.ts                         # Stock atómico + CRUD reservas + encargos
│   ├── edge-config.ts                # Sabores y config desde Edge Config
│   ├── features.ts                   # Feature flags (cookie > Edge Config > .env)
│   ├── horario.ts                    # Lógica 07:00-14:00 Europe/Madrid
│   ├── reservas.ts                   # Lógica de negocio de reservas
│   ├── encargos.ts                   # Lógica de encargos: validación + emails
│   └── temporada.ts                  # Cálculo Pascua + torrijas automáticas
│
└── public/
    └── tortillas/                    # Imágenes WebP de cada tortilla
```

---

## Deploy

```bash
# Deploy manual
vercel --prod

# Auto-deploy: cualquier push a main → Vercel despliega automáticamente
```

> Vercel usa **pnpm**. Si instalas algo con `npm`, ejecuta `pnpm install` antes del push para sincronizar el lockfile.

---

## Checklist para puesta en marcha

- [ ] Vercel KV creado y conectado al proyecto
- [ ] Edge Config creado con el JSON de sabores y `featureEncargos: false`
- [ ] `RESEND_API_KEY` configurada en Vercel
- [ ] `ADMIN_EMAIL` y `FROM_EMAIL` configuradas en Vercel
- [ ] Dominio verificado en Resend (necesario para enviar emails en producción)
- [ ] Imágenes WebP de cada tortilla en `/public/tortillas/`
- [ ] Probado en móvil real (iPhone + Android)
- [ ] Flag `featureEncargos` activado cuando el cliente quiera lanzar la Fase 2
