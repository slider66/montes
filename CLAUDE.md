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
- **`lib/types.ts`** — Tipos TypeScript. `esTemporada?: boolean` = no reservable. `Encargo`, `LineaEncargo`, `EstadoEncargo` ya implementados.
- **`lib/horario.ts`** — Horario 07:00-14:00 Europe/Madrid. Validación en Edge Runtime.
- **`lib/kv.ts`** — Stock atómico con Vercel KV. `MAX_TORTILLAS_DIA = 8`. Helpers de encargos incluidos.
- **`lib/encargos.ts`** — Lógica de encargos: validación Zod, regla 48h, cálculo total servidor, emails Resend.
- **`app/api/encargos/route.ts`** — POST Edge Runtime para crear encargos.
- **`components/encargo/`** — Wizard completo: catálogo, resumen, formulario, confirmación.

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
- Hero con imagen real, logo, stats
- Catálogo bento con imágenes WebP por tortilla
- Calendario de disponibilidad (7 días)
- Sistema de reservas con stock en tiempo real (Vercel KV)
- Productos de temporada automáticos (torrijas en Semana Santa)
- Footer completo con horario, dirección, rating Google
- SEO, favicon, OG image
- Feature flag infrastructure lista para Fase 2

**Para entregar Fase 1:** el flag `featureEncargos` está a `false`. El cliente ve la landing sin rastro de encargos.

---

### ✅ FASE 2 — Sistema de Encargos (COMPLETADA)

> **Plan detallado en [`FASE2.md`](./FASE2.md)** — tipos, KV schema, API spec, árbol de componentes, emails, reglas de negocio y checklist completo.

**Activación:** cambiar `featureEncargos = true` en Edge Config (sin redeploy).

#### Fase 2A ✅ — Tipos + Storage + API
- `lib/types.ts` — `LineaEncargo`, `Encargo`, `EstadoEncargo`, `CrearEncargoInput`, `CrearEncargoResponse`
- `lib/kv.ts` — keys `encargo:*`, helpers `guardarEncargo()`, `getEncargo()`, `getEncargosPorFecha()`
- `lib/encargos.ts` — validación Zod, regla 48h (date-fns-tz), total en servidor, emails Resend
- `app/api/encargos/route.ts` — POST Edge Runtime

Reglas de negocio implementadas:
- Mínimo **48h de antelación** (zona Europe/Madrid)
- Máximo **30 días** en el futuro
- Slots de recogida: **08:00 – 13:30**
- Total siempre recalculado en servidor

#### Fase 2B ✅ — Cart UI
- `EncargoWizard.tsx` — shell con `useReducer`, 4 stages, progress bar, layout desktop/mobile
- `TortillaLineaCard.tsx` — stepper mediana + grande, subtotal en vivo
- `CatalogoPedido.tsx` — grid de cards
- `ResumenEncargo.tsx` — sidebar sticky (desktop) + vista resumen (stage 1)
- `CartDrawerMobile.tsx` — barra flotante + cajón Framer Motion slide-up

#### Fase 2C ✅ — Formulario + Confirmación
- `FormDatosContacto.tsx` — nombre, teléfono, email con validación inline
- `PickerFechaEncargo.tsx` — calendario hoy+2 hasta hoy+30, estilo CalendarioSemana
- `PickerHoraEncargo.tsx` — slots 08:00 a 13:30
- `StepDatos.tsx` — compone form + pickers + llamada a API
- `ConfirmacionEncargo.tsx` — ID encargo, tabla, botón WhatsApp deep link, descarga .ics

#### Fase 2D ✅ — Emails (incluidos en 2A)
- Email admin: `Nuevo encargo — [Nombre] · [Fecha] [Hora]`
- Email cliente: `¡Encargo confirmado! — Recogida el [Fecha]`
- Ambos en `lib/encargos.ts`, fire & forget (no bloquea la respuesta)

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
- **Archivos sensibles y git**: estar en `.gitignore` no retira un archivo que ya fue commiteado. Si eso ocurre, ejecutar `git rm --cached <archivo>` y hacer commit. El historial anterior seguirá teniendo el token — rotar la clave inmediatamente en ese caso.
- **Commits**: no incluir línea `Co-Authored-By: Claude` en los mensajes de commit.

## Deploy

- Rama `main` → Vercel (auto-deploy).
- Vercel usa **pnpm**. Si instalas algo con npm, ejecuta `pnpm install` antes del push.

## Archivos sensibles

| Archivo | Contenido | En git |
|---------|-----------|--------|
| `.env.local` | Variables de entorno | No |
| `.mcp.json` | Token API nano-banana MCP | No |
| `.claude/settings.local.json` | Config local Claude Code | No |
