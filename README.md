# Montes — La mejor tortilla de San Agustín de Guadalix

Web App de reservas de tortillas artesanales con stock limitado. Construida sobre el stack nativo de Vercel: Next.js 15, Vercel KV, Edge Config y Blob.

## Documentación

| Documento | Descripción |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arquitectura técnica completa, modelo de datos, flujo de reserva y MCP |
| [NEXT_STEPS.md](NEXT_STEPS.md) | Hoja de ruta de implementación por fases con código |

## Stack

- **Framework**: Next.js 15 App Router + React 19 Server Components
- **Estilos**: Tailwind CSS v4
- **Animaciones**: Framer Motion 11
- **Stock real-time**: Vercel KV (Redis)
- **Configuración**: Vercel Edge Config
- **Imágenes**: Vercel Blob
- **Emails**: Resend

## Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Descargar variables de entorno de Vercel
vercel env pull

# 3. Arrancar en desarrollo
npm run dev
```

## Estructura de Archivos

```
├── app/                     # Next.js App Router
│   ├── api/reservas/        # POST → crear reserva (Edge Runtime)
│   ├── api/stock/[sabor]/   # GET → stock actual
│   └── reservar/            # Formulario de reserva
├── components/ui/           # TortillaCard, StockBadge, HorarioAlert
├── lib/
│   ├── kv.ts                # Helpers Vercel KV (stock atómico)
│   ├── edge-config.ts       # Helpers Edge Config (sabores)
│   ├── reservas.ts          # Lógica de negocio
│   ├── horario.ts           # Validación 07:00-14:00 Europe/Madrid
│   └── types.ts             # TypeScript types
└── middleware.ts             # Edge: bloqueo fuera de horario
```

## Horario de Reservas

Las reservas solo se aceptan de **07:00 a 14:00** (hora de Madrid). Fuera de ese rango, la API devuelve `423 Locked` y el botón de reserva se deshabilita automáticamente.
