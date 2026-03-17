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

- **`app/page.tsx`** — Página principal. Contiene `SABORES_DEMO` (datos de tortillas cuando KV/EdgeConfig están vacíos) y `SABOR_TORRIJAS` (producto estacional).
- **`lib/temporada.ts`** — Calcula Pascua (algoritmo Gregoriano Anónimo) y expone `esTiempoTorrijas()`. No tocar el algoritmo.
- **`lib/types.ts`** — Tipo `Sabor`. Campo `esTemporada?: boolean` indica que no es reservable, solo disponible en local.
- **`lib/horario.ts`** — Horario 07:00-14:00 Europe/Madrid. Validación en Edge Runtime.
- **`lib/kv.ts`** — Stock atómico con Vercel KV. `MAX_TORTILLAS_DIA = 8`.

## Paleta de colores

Paleta "tortilla" oscura. No usar colores arbitrarios — usar estas referencias:

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
- Para convertir PNG a WebP: `node -e "require('sharp')('ruta.png').webp({quality:87}).toFile('ruta.webp').then(console.log)"`
- `sharp` NO debe estar en `package.json` (causó conflicto con pnpm en Vercel). Instalarlo temporalmente con `npm install sharp`, convertir, y luego `npm uninstall sharp`.
- El hero usa `/public/tortilla-hero.webp`

## Reglas importantes

- **No usar PowerShell** para comandos npm/node — usar CMD.
- **No añadir `sharp` a `package.json`** — Vercel usa pnpm y el lockfile se desincroniza.
- **No revertir `BentoCatalogo.tsx`** — el linter tiende a quitar el `import Image from 'next/image'`. Si las imágenes dejan de verse, es porque el linter revirtió el archivo.
- **No modificar el algoritmo de Pascua** en `lib/temporada.ts` — es matemáticamente correcto.
- Las imágenes de tortillas deben ser siempre **WebP**, nunca PNG en producción.
- `.mcp.json` y `.claude/settings.local.json` están en `.gitignore` — contienen tokens/API keys.

## Productos de temporada

Las torrijas aparecen automáticamente 30 días antes de Pascua hasta 7 días después. Para añadir otro producto estacional en el futuro, seguir el mismo patrón en `lib/temporada.ts` y `app/page.tsx`.

## Deploy

- Rama `main` → Vercel (auto-deploy).
- Vercel usa **pnpm**. El `pnpm-lock.yaml` ya está commiteado y sincronizado.
- Si se instala algún paquete con npm localmente, ejecutar `pnpm install` después para sincronizar el lockfile antes de hacer push.

## Archivos sensibles

| Archivo | Contenido | En git |
|---------|-----------|--------|
| `.env.local` | Variables de entorno | No |
| `.mcp.json` | Token API nano-banana/Gemini | No |
| `.claude/settings.local.json` | Config local Claude Code | No |
