# Café & Tortilla Montes

Web app de reservas para **Café & Tortilla Montes** — San Agustín de Guadalix. Stock limitado de tortillas artesanales, sistema de reserva online, catálogo visual con imágenes reales y productos de temporada automáticos.

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 App Router + React 19 |
| Estilos | Tailwind CSS v4 + paleta tortilla |
| Animaciones | Framer Motion 11 |
| Stock en tiempo real | Vercel KV (Redis) |
| Configuración dinámica | Vercel Edge Config |
| Imágenes | Vercel Blob |
| Emails | Resend |
| Deploy | Vercel (rama `main`) |

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Variables de entorno desde Vercel
vercel env pull

# Desarrollo (usar CMD, no PowerShell)
npm run dev
```

> En equipos corporativos con PowerShell bloqueado, usar **Command Prompt** (CMD).

## Estructura

```
├── app/
│   ├── page.tsx                 # Home: Hero + Calendario + Catálogo
│   ├── api/reservas/            # POST → crear reserva (Edge Runtime)
│   ├── api/stock/[sabor]/       # GET → stock actual
│   └── reservar/                # Formulario de reserva
├── components/ui/
│   ├── Hero3D.tsx               # Hero con imagen fija + stats
│   ├── BentoCatalogo.tsx        # Grid bento con imágenes WebP
│   ├── CalendarioSemana.tsx     # Selector de fecha (7 días)
│   ├── MarqueeTicker.tsx        # Ticker animado de productos
│   ├── CartaSection.tsx         # Carta completa del café
│   └── Footer.tsx
├── lib/
│   ├── types.ts                 # Tipos TypeScript (Sabor, Reserva…)
│   ├── kv.ts                    # Stock atómico con Vercel KV
│   ├── edge-config.ts           # Sabores dinámicos
│   ├── horario.ts               # Lógica 07:00-14:00 Europe/Madrid
│   ├── reservas.ts              # Lógica de negocio
│   └── temporada.ts             # Cálculo de Pascua + torrijas
└── public/
    └── tortillas/               # Imágenes WebP de cada tortilla
```

## Catálogo de tortillas

| ID | Nombre | Precio mediana | Precio grande |
|----|--------|---------------|---------------|
| `clasica-con` | Clásica con Cebolla | 8,00 € | 14,50 € |
| `clasica-sin` | Clásica sin Cebolla | 8,00 € | 14,50 € |
| `jamon-queso` | Jamón York y Queso | 10,00 € | 18,50 € |
| `chorizo` | Chorizo | 10,00 € | 18,50 € |
| `morcilla` | Morcilla | 10,00 € | 18,50 € |
| `atun` | Atún | 10,00 € | 18,50 € |

También: croquetas de jamón (6 uds 6€ / 12 uds 12€), café, bollería, pan, refrescos, cerveza y zumo de naranja.

## Productos de temporada

### Torrijas (automático)

La lógica en `lib/temporada.ts` calcula la fecha de Pascua con el **algoritmo Gregoriano Anónimo** y activa la card de torrijas automáticamente:

- **Inicio**: 30 días antes de Pascua
- **Fin**: 7 días después de Pascua

| Año | Pascua | Empieza | Termina |
|-----|--------|---------|---------|
| 2025 | 20 abr | 21 mar | 27 abr |
| 2026 | 5 abr | 6 mar | 12 abr |
| 2027 | 28 mar | 26 feb | 4 abr |

No requiere intervención manual — funciona todos los años.

## Imágenes

Todas las imágenes del catálogo están en `/public/tortillas/` en formato **WebP** (~94% menos peso que PNG original).

Para añadir o actualizar una imagen:
1. Pon el PNG en `/public/tortillas/`
2. Convierte con Node.js: `node -e "require('sharp')('public/tortillas/nueva.png').webp({quality:87}).toFile('public/tortillas/nueva.webp').then(console.log)"`
3. Elimina el PNG original
4. Actualiza la ruta en `app/page.tsx` (campo `imagenUrl`)

## Horario de reservas

Solo se aceptan reservas de **07:00 a 14:00** (hora de Madrid). Fuera de ese rango la API devuelve `423 Locked` y el botón de reserva se deshabilita automáticamente.

## Variables de entorno necesarias

```env
KV_REST_API_URL=
KV_REST_API_TOKEN=
EDGE_CONFIG=
RESEND_API_KEY=
BLOB_READ_WRITE_TOKEN=
```
