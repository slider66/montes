# Arquitectura Técnica — Montes Web App
> Cafetería de Tortillas · San Agustín de Guadalix · Vercel Native Stack

---

## 1. Visión General

```
Cliente (Mobile/Desktop)
        │
        ▼
  Vercel Edge Network
        │
   ┌────┴────────────────────────────────┐
   │  Next.js 15 App Router              │
   │  ├─ Server Components (RSC)         │
   │  ├─ Route Handlers (API)            │
   │  └─ Middleware (Edge Runtime)       │
   └────┬────────────────────────────────┘
        │
   ┌────┼────────────────────────────────┐
   │    │    Vercel Storage              │
   │    ├─ KV (Redis) → Stock real-time  │
   │    ├─ Edge Config → Horario/Flavors │
   │    └─ Blob → Fotos tortillas        │
   └────────────────────────────────────┘
```

---

## 2. Tech Stack

| Capa | Tecnología | Propósito |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR + RSC + Route Handlers |
| Estilo | Tailwind CSS v4 | Utility-first, zero-runtime |
| Animaciones | Framer Motion 11 | Micro-interacciones catálogo |
| Stock en tiempo real | Vercel KV (Upstash Redis) | Contador por sabor/día, atómico |
| Configuración | Vercel Edge Config | Horario, metadatos de los 8 sabores |
| Media | Vercel Blob | Fotos de tortillas (CDN automático) |
| Notificaciones | Resend | Email confirmación de reserva |
| Pagos (opcional) | Stripe | Reserva con señal/pago anticipado |
| Analytics | Vercel Analytics + Speed Insights | Core Web Vitals en producción |

---

## 3. Estructura de Archivos

```
montes/
├── app/
│   ├── layout.tsx                    # Root layout + metadata
│   ├── page.tsx                      # Home — catálogo de tortillas
│   ├── reservar/
│   │   ├── page.tsx                  # Formulario de reserva
│   │   └── confirmacion/
│   │       └── page.tsx              # Confirmación post-reserva
│   ├── api/
│   │   ├── reservas/
│   │   │   └── route.ts              # POST → crear reserva (Edge Runtime)
│   │   └── stock/
│   │       └── [sabor]/
│   │           └── route.ts          # GET → stock actual por sabor
│   └── admin/
│       ├── layout.tsx                # Admin layout protegido
│       ├── page.tsx                  # Dashboard reservas del día
│       └── stock/
│           └── page.tsx              # Gestión manual de stock
├── components/
│   ├── ui/
│   │   ├── TortillaCard.tsx          # Tarjeta sabor + stock badge
│   │   ├── StockBadge.tsx            # Indicador visual unidades
│   │   ├── ReservaForm.tsx           # Formulario multi-step
│   │   ├── CalendarPicker.tsx        # Selector 14 días vista
│   │   └── HorarioAlert.tsx          # Banner fuera de horario
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── kv.ts                         # Helpers Vercel KV (stock)
│   ├── edge-config.ts                # Helpers Edge Config (sabores)
│   ├── reservas.ts                   # Lógica de negocio
│   ├── horario.ts                    # Validación horario 07:00-14:00
│   └── types.ts                      # TypeScript types
├── middleware.ts                      # Edge: bloqueo fuera de horario
├── public/
│   └── images/
│       └── logo.svg
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## 4. Modelo de Datos en Vercel KV

### Claves Redis

```
# Stock disponible por sabor y fecha
stock:{fecha}:{sabor}          → integer  (ej: stock:2026-03-20:clasica → 12)

# Reservas confirmadas
reserva:{id}                   → JSON     (datos completa de reserva)

# Índice por fecha para admin
reservas:fecha:{fecha}         → SET      (ids de reservas del día)

# Índice por cliente (email)
reservas:cliente:{email}       → SET      (ids historial cliente)
```

### Estructura JSON de una Reserva

```json
{
  "id": "res_abc123",
  "cliente": {
    "nombre": "María García",
    "email": "maria@ejemplo.com",
    "telefono": "+34 600 000 000"
  },
  "fecha": "2026-03-20",
  "sabor": "clasica",
  "cantidad": 2,
  "estado": "confirmada",
  "creadaEn": "2026-03-16T10:30:00Z"
}
```

---

## 5. Edge Config — Configuración de Sabores

```json
{
  "horario": {
    "apertura": "07:00",
    "cierre": "14:00",
    "zona": "Europe/Madrid"
  },
  "stockDiarioPorSabor": 20,
  "diasReservaAntelacion": 14,
  "sabores": [
    {
      "id": "clasica",
      "nombre": "Clásica",
      "descripcion": "Huevo, patata y cebolla pochada. La de toda la vida.",
      "emoji": "🥚",
      "precio": 12.50,
      "activo": true
    },
    {
      "id": "jamon-queso",
      "nombre": "Jamón y Queso",
      "descripcion": "Jamón serrano y queso manchego fundido.",
      "emoji": "🧀",
      "precio": 15.00,
      "activo": true
    },
    {
      "id": "trufa",
      "nombre": "Trufa Negra",
      "descripcion": "Trufa negra de temporada con aceite de oliva virgen extra.",
      "emoji": "🍄",
      "precio": 22.00,
      "activo": true
    },
    {
      "id": "espinacas-gambas",
      "nombre": "Espinacas y Gambas",
      "descripcion": "Espinacas frescas salteadas con gambas al ajillo.",
      "emoji": "🦐",
      "precio": 16.50,
      "activo": true
    },
    {
      "id": "chorizo",
      "nombre": "Chorizo Ibérico",
      "descripcion": "Chorizo ibérico de bellota con pimiento verde.",
      "emoji": "🌶️",
      "precio": 14.00,
      "activo": true
    },
    {
      "id": "vegana",
      "nombre": "Vegana",
      "descripcion": "Patata, calabacín, pimiento rojo y tomate confitado.",
      "emoji": "🌱",
      "precio": 13.00,
      "activo": true
    },
    {
      "id": "bacalao",
      "nombre": "Bacalao y Pimientos",
      "descripcion": "Bacalao desalado con pimientos del piquillo asados.",
      "emoji": "🐟",
      "precio": 17.00,
      "activo": true
    },
    {
      "id": "setas",
      "nombre": "Setas de Temporada",
      "descripcion": "Mix de setas silvestres con ajo y perejil.",
      "emoji": "🍄",
      "precio": 15.50,
      "activo": true
    }
  ]
}
```

---

## 6. Flujo de Reserva

```
Usuario selecciona sabor + fecha + cantidad
              │
              ▼
    Middleware Edge valida horario
    (07:00 - 14:00 Europe/Madrid)
              │
        ┌─────┴─────┐
    Dentro      Fuera
    horario     horario → 423 Locked
        │
        ▼
    Route Handler POST /api/reservas
        │
        ▼
    kv.decrBy(`stock:{fecha}:{sabor}`, cantidad)
    usando pipeline atómico Redis
        │
        ├── stock >= 0 → Reserva confirmada
        │   ├── kv.set(`reserva:{id}`, datos)
        │   ├── kv.sAdd(`reservas:fecha:{fecha}`, id)
        │   └── Resend → Email confirmación
        │
        └── stock < 0 → kv.incrBy (rollback)
                        → 409 Conflict "Sin stock"
```

---

## 7. Servidores MCP Recomendados

### Para el Flujo de Desarrollo y Despliegue

| Servidor MCP | Uso en Montes |
|---|---|
| **`@modelcontextprotocol/server-github`** | Crear PRs, revisar código, gestionar issues desde el IDE |
| **`vercel/mcp-adapter`** | Desplegar desde el agente, consultar logs de producción, gestionar env vars de KV/Blob/Edge Config |
| **`@stripe/agent-toolkit`** (MCP) | Si se añade pago de señal: crear payment links, consultar pagos pendientes |
| **`resend-mcp`** | Gestionar plantillas de email de confirmación desde el agente |
| **`@modelcontextprotocol/server-filesystem`** | Acceso al proyecto local para que el agente edite archivos directamente |

### Configuración `.cline_mcp_settings.json`

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}" }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "c:/ProyectosDEV/montes"]
    },
    "vercel": {
      "command": "npx",
      "args": ["-y", "vercel-mcp-adapter"],
      "env": { "VERCEL_TOKEN": "${VERCEL_TOKEN}" }
    }
  }
}
```

---

## 8. Variables de Entorno

```bash
# .env.local
KV_URL=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...

EDGE_CONFIG=...

BLOB_READ_WRITE_TOKEN=...

RESEND_API_KEY=...

NEXTAUTH_SECRET=...         # Admin panel
ADMIN_EMAIL=montes@ejemplo.com

NEXT_PUBLIC_URL=https://montes.vercel.app
```

---

## 9. Performance Budget (LCP < 1.2s)

| Optimización | Implementación |
|---|---|
| Zero JS en catálogo | Server Components puros, sin `use client` en página home |
| Imágenes | `next/image` + Vercel Blob CDN + `priority` en above-the-fold |
| Fuentes | `next/font` con `display: swap` → Inter + variable local |
| Stock en tiempo real | `router.refresh()` cada 30s en cliente, sin websockets |
| Bundle splitting | Dynamic imports para `ReservaForm` (solo cuando el usuario hace click) |
| CSS | Tailwind v4 con Oxide engine → <5KB CSS final |
| Edge Runtime | Middleware + API routes corren en Edge, no en Node.js serverless |
