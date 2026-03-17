# CLAUDE.md — Guía para Claude Code

## Proyecto

Web app de reservas para **Café & Tortilla Montes** (San Agustín de Guadalix). Next.js 15 + Vercel stack. Reservas online de tortillas artesanales con stock limitado (8/día).

## Comandos esenciales

```bash
# Desarrollo — usar CMD (no PowerShell, bloqueado por GPO corporativa)
npm run dev

# Lint
npm run lint

# Build
npm run build
```

## Arquitectura clave

- **`app/page.tsx`** — Página principal. Contiene `SABORES_DEMO` y `SABOR_TORRIJAS`. Lee `isEncargosEnabled()` para mostrar/ocultar el CTA de encargos.
- **`lib/features.ts`** — Feature flags. Lee de Edge Config en prod, de `.env.local` en dev. NO añadir lógica de negocio aquí.
- **`lib/temporada.ts`** — Calcula Pascua (algoritmo Gregoriano Anónimo). No tocar el algoritmo.
- **`lib/types.ts`** — Tipos TypeScript. `esTemporada?: boolean` = no reservable. `Encargo` y `LineaEncargo` se añadirán en Fase 2.
- **`lib/horario.ts`** — Horario 07:00-14:00 Europe/Madrid. Validación en Edge Runtime.
- **`lib/kv.ts`** — Stock atómico con Vercel KV. `MAX_TORTILLAS_DIA = 8`.

---

## Sistema de Feature Flags

### Cómo funciona

El flag `featureEncargos` controla toda la Fase 2 (encargos). Cuando está `false` (defecto):
- El CTA de encargos **no aparece** en la homepage
- El link en el footer **no aparece**
- `/encargo` **redirige a `/`**
- La API `/api/encargos` puede existir en el código pero nadie llega a ella

### Activar en producción (sin redeploy)
```
Dashboard Vercel → Storage → Edge Config → Editar JSON
Añadir: { "featureEncargos": true }
```
Activo en ~5 segundos. Sin tocar código, sin redeploy.

### Activar en desarrollo local
```bash
# .env.local
FEATURE_ENCARGOS=true
```

---

## Hoja de ruta por fases

### ✅ FASE 1 — Landing + Reservas (COMPLETADA)
Todo lo que está en `main` actualmente:
- Hero con imagen real, logo, stats
- Catálogo bento con imágenes WebP por tortilla
- Calendario de disponibilidad (7 días)
- Sistema de reservas con stock en tiempo real (Vercel KV)
- Productos de temporada automáticos (torrijas en Semana Santa)
- Footer completo con horario, dirección, rating Google
- SEO, favicon, OG image
- Feature flag infrastructure lista para Fase 2

**Para entregar Fase 1:** el flag `featureEncargos` está a `false`. El cliente ve la landing completa sin ningún rastro de encargos.

---

### 🔲 FASE 2 — Sistema de Encargos

**Activación:** cambiar `featureEncargos = true` en Edge Config (sin redeploy).

#### Fase 2A — Tipos + Storage + API (commit independiente)

Archivos a crear/modificar:
- `lib/types.ts` — añadir `LineaEncargo`, `Encargo`, `EstadoEncargo`, `CrearEncargoInput`, `CrearEncargoResponse`
- `lib/kv.ts` — añadir keys `encargo:*`, `encargos:fecha:*` y helpers `guardarEncargo()`, `getEncargo()`, `getEncargosPorFecha()`
- `lib/encargos.ts` — lógica de negocio: validación Zod, regla 48h, cálculo total, llamadas Resend
- `app/api/encargos/route.ts` — POST handler (Edge Runtime, fuera del matcher de middleware)
- `middleware.ts` — NO modificar (el matcher actual solo cubre `/reservar` y `/api/reservas`, encargos ya quedan fuera)

Reglas de negocio:
- Mínimo **48h de antelación** (validar con `date-fns-tz`, zona `Europe/Madrid`)
- Máximo **30 días** en el futuro
- Recogida solo **07:00–13:30** (slots cada hora)
- Total se recalcula en servidor (no confiar en el del cliente)

#### Fase 2B — Cart UI (commit independiente)

Archivos a crear en `components/encargo/`:
- `EncargoWizard.tsx` — shell cliente con `useReducer` para el carrito. 4 stages: catálogo → resumen → datos → confirmación
- `CatalogoPedido.tsx` — columna izquierda con tortillas y croquetas
- `TortillaLineaCard.tsx` — card por sabor: toggle mediana/grande, stepper +/-, subtotal en vivo
- `CroquetaLineaCard.tsx` — card croquetas: packs de 6 o 12 uds
- `ResumenEncargo.tsx` — columna derecha sticky: lista de líneas, total, CTA siguiente stage
- `CartDrawerMobile.tsx` — cajón inferior para móvil (Framer Motion slide-up)

Actualizar:
- `app/encargo/page.tsx` — sustituir el placeholder por `<EncargoWizard sabores={sabores} />`

#### Fase 2C — Formulario + Confirmación (commit independiente)

Archivos a crear:
- `FormDatosContacto.tsx` — nombre, teléfono, email con validación Zod en cliente
- `PickerFechaEncargo.tsx` — calendario desde hoy+2 días, máx 30 días. Estilo igual que `CalendarioSemana.tsx`
- `PickerHoraEncargo.tsx` — radio group de slots: 08:00, 09:00, 10:00, 11:00, 12:00, 13:00, 13:30
- `ConfirmacionEncargo.tsx` — ID encargo, tabla resumen, botón WhatsApp deep link, descarga .ics

#### Fase 2D — Emails (commit independiente)

En `lib/encargos.ts`, añadir HTML de emails vía Resend (ya instalado):

**Email admin:**
- Subject: `Nuevo encargo — [Nombre] · [Fecha] [Hora]`
- Tabla: Producto | Variante | Tamaño | Uds | Precio | Subtotal
- Total, notas, teléfono clickable, ID encargo

**Email cliente:**
- Subject: `¡Encargo confirmado! — Recogida el [Fecha]`
- Resumen del pedido, dirección de recogida, teléfono del local, ID encargo

---

## Paleta de colores

| Uso | Color |
|-----|-------|
| Fondo principal | `#1A0E05` |
| Fondo hero radial | `#3D1C00` |
| Texto principal | `#FAF0DC` / `#F2E2C0` |
| Acento oro | `#DFA855` / `#EAB85A` |
| Borde sutil | `rgba(196,120,50,0.14)` |
| Borde destacado | `rgba(196,120,50,0.28)` |
| Temporada (torrijas) | `#F5C842` |

## Imágenes

- Formato: **WebP** en `/public/tortillas/`
- Convertir: `npm install sharp` → convertir → `npm uninstall sharp` → `pnpm install`
- **No dejar `sharp` en `package.json`** — Vercel usa pnpm y el lockfile se desincroniza

## Reglas importantes

- **No usar PowerShell** — usar CMD (GPO corporativa bloquea scripts).
- **No revertir `BentoCatalogo.tsx`** — el linter elimina `import Image`. Si las imágenes desaparecen, es eso.
- **No modificar el algoritmo de Pascua** en `lib/temporada.ts`.
- **No añadir `sharp` a `package.json`** — ver sección Imágenes.
- `.mcp.json` y `.claude/settings.local.json` en `.gitignore` — contienen tokens.

## Deploy

- Rama `main` → Vercel (auto-deploy).
- Vercel usa **pnpm**. Si instalas algo con npm, ejecuta `pnpm install` antes del push.

## Archivos sensibles

| Archivo | Contenido | En git |
|---------|-----------|--------|
| `.env.local` | Variables de entorno | No |
| `.mcp.json` | Token API Gemini | No |
| `.claude/settings.local.json` | Config local Claude Code | No |
