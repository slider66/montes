# FASE 2 — Sistema de Encargos
## Plan de implementación detallado

> **Estado**: Pendiente de implementación. La landing (Fase 1) está completa y en producción.
> **Activación**: `featureEncargos=true` en Edge Config (sin redeploy). Para demo: DemoSwitch en esquina inferior derecha.
> **Fecha de planificación**: 2026-03-18

---

## Índice

1. [Contexto y decisiones de arquitectura](#1-contexto-y-decisiones-de-arquitectura)
2. [Modelo de datos completo](#2-modelo-de-datos-completo)
3. [KV Schema](#3-kv-schema)
4. [API spec](#4-api-spec)
5. [Wizard — flujo y estado](#5-wizard--flujo-y-estado)
6. [Árbol de componentes](#6-árbol-de-componentes)
7. [Emails](#7-emails)
8. [Reglas de negocio](#8-reglas-de-negocio)
9. [Checklist de implementación](#9-checklist-de-implementación)
10. [Guía para arrancar en otro equipo](#10-guía-para-arrancar-en-otro-equipo)

---

## 1. Contexto y decisiones de arquitectura

### Qué es un "encargo"
Un pedido grande para recoger en el local. A diferencia de las reservas (1–4 tortillas, mismo día o siguiente), los encargos:
- Son pedidos de múltiples tortillas (medianas o grandes) + croquetas opcionales
- Requieren **mínimo 48h de antelación**
- Se recogen en un slot de hora fija (08:00, 09:00, ..., 13:30)
- El total se calcula siempre en servidor
- No hay pago online — se paga al recoger

### Separación del sistema de reservas
Los encargos son un sistema paralelo e independiente de las reservas. Comparten:
- El tipo `Cliente` (nombre, email, teléfono)
- La misma base de datos KV (con prefijos distintos)
- El mismo servicio de email (Resend)

No comparten:
- Stock (las reservas tienen stock de 8/día; los encargos no tienen límite)
- Horario de apertura (las reservas solo se crean de 07:00-14:00; los encargos se pueden crear en cualquier momento)
- Middleware (el matcher actual NO cubre encargos a propósito)

### Wizard vs formulario lineal
Se usa un wizard de 4 etapas (no un formulario lineal) porque:
1. El catálogo necesita interactividad con estado complejo (carrito)
2. El resumen antes de datos reduce errores del cliente
3. El UX de e-commerce es más familiar que un formulario largo
4. `useReducer` permite deshacer/rehacer entre etapas sin perder datos

### Edge Runtime vs Node.js
La API route `/api/encargos` corre en **Edge Runtime** para consistencia con el resto del proyecto y latencia mínima. Esto limita las librerías disponibles (no `fs`, no `crypto` nativo de Node) pero `nanoid`, `date-fns-tz` y Zod funcionan en Edge.

---

## 2. Modelo de datos completo

### Añadir a `lib/types.ts`

```typescript
// ─── Encargos ─────────────────────────────────────────────────────────────────

export type TamañoTortilla = 'mediana' | 'grande'

/**
 * Una línea de tortilla dentro de un encargo.
 * El servidor recalcula precioUnitario y subtotal — no confiar en el cliente.
 */
export interface LineaTortilla {
  saborId: string          // Debe existir en Edge Config y estar activo
  nombre: string           // Denormalizado para legibilidad en emails/admin
  tamaño: TamañoTortilla
  cantidad: number         // >= 1
  precioUnitario: number   // precio o precioGrande según tamaño
  subtotal: number         // precioUnitario * cantidad
}

/**
 * Una línea de croquetas. Pack de 6 (6€) o pack de 12 (12€).
 * El precio de los packs está hardcodeado en el servidor.
 */
export interface LineaCroqueta {
  pack: 6 | 12
  cantidad: number         // número de packs >= 1
  precioUnitario: number   // 6 o 12
  subtotal: number         // precioUnitario * cantidad
}

export type EstadoEncargo = 'pendiente' | 'confirmado' | 'cancelado' | 'completado'

/**
 * Encargo completo tal como se guarda en KV.
 */
export interface Encargo {
  id: string               // "enc_" + nanoid(8)
  cliente: Cliente         // Reutiliza el tipo existente
  fecha: string            // ISO date: "2026-03-22"
  hora: string             // "09:00" — uno de los slots definidos
  lineasTortilla: LineaTortilla[]
  lineasCroqueta: LineaCroqueta[]
  total: number            // Suma de todos los subtotales, calculada en servidor
  notas?: string           // Campo libre, max 500 chars
  estado: EstadoEncargo
  creadoEn: string         // ISO datetime (Date.toISOString())
}

// ─── API Encargos ─────────────────────────────────────────────────────────────

/**
 * Payload que envía el cliente al POST /api/encargos.
 * El servidor ignora precioUnitario y subtotal del cliente.
 */
export interface CrearEncargoInput {
  cliente: {
    nombre: string
    email: string
    telefono: string
  }
  fecha: string            // "2026-03-22"
  hora: string             // "09:00"
  lineasTortilla: {
    saborId: string
    tamaño: TamañoTortilla
    cantidad: number
  }[]
  lineasCroqueta: {
    pack: 6 | 12
    cantidad: number
  }[]
  notas?: string
}

export interface CrearEncargoResponse {
  ok: true
  encargo: Encargo
}

// ErrorResponse ya existe y se reutiliza (añadir códigos de error al union type)
// Añadir a ErrorCode: 'ENCARGO_INVALIDO' | 'FECHA_ENCARGO_INVALIDA' | 'HORA_INVALIDA'
```

---

## 3. KV Schema

### Añadir a `lib/kv.ts`

```typescript
// Nuevas claves en el objeto KEYS:
encargo: (id: string) => `encargo:${id}`,
encargosPorFecha: (fecha: string) => `encargos:fecha:${fecha}`,

// Constantes
export const PRECIO_CROQUETAS: Record<6 | 12, number> = { 6: 6, 12: 12 }
export const SLOTS_HORA_ENCARGO = ['08:00','09:00','10:00','11:00','12:00','13:00','13:30'] as const
export type SlotHora = typeof SLOTS_HORA_ENCARGO[number]
```

### Funciones a añadir

```typescript
/**
 * Guarda un encargo en KV con TTL de 90 días.
 * Indexa por fecha para consultas admin.
 */
export async function guardarEncargo(encargo: Encargo): Promise<void>

/**
 * Recupera un encargo por ID.
 */
export async function getEncargo(id: string): Promise<Encargo | null>

/**
 * Lista todos los encargos de una fecha concreta.
 * Útil para el panel admin.
 */
export async function getEncargosPorFecha(fecha: string): Promise<Encargo[]>
```

### Implementación de referencia

```typescript
export async function guardarEncargo(encargo: Encargo): Promise<void> {
  const client = getKV()
  if (!client) return
  const pipeline = client.pipeline()
  pipeline.set(KEYS.encargo(encargo.id), JSON.stringify(encargo), { ex: 60 * 60 * 24 * 90 })
  pipeline.sadd(KEYS.encargosPorFecha(encargo.fecha), encargo.id)
  pipeline.expire(KEYS.encargosPorFecha(encargo.fecha), 60 * 60 * 24 * 90)
  await pipeline.exec()
}

export async function getEncargo(id: string): Promise<Encargo | null> {
  const client = getKV()
  if (!client) return null
  const raw = await client.get<string>(KEYS.encargo(id))
  if (!raw) return null
  return JSON.parse(raw) as Encargo
}

export async function getEncargosPorFecha(fecha: string): Promise<Encargo[]> {
  const client = getKV()
  if (!client) return []
  const ids = await client.smembers(KEYS.encargosPorFecha(fecha))
  if (!ids.length) return []
  const results = await Promise.all(ids.map(id => getEncargo(id)))
  return results.filter((e): e is Encargo => e !== null)
}
```

---

## 4. API spec

### `POST /api/encargos`

**Archivo**: `app/api/encargos/route.ts`

**Runtime**: Edge

**Auth**: ninguna (público)

**Middleware**: el matcher actual NO cubre esta ruta (`/reservar` y `/api/reservas` únicamente). No añadir encargos al matcher — los encargos se pueden crear a cualquier hora del día.

#### Request

```
Content-Type: application/json
Body: CrearEncargoInput
```

#### Validación Zod (en `lib/encargos.ts`)

```typescript
const schema = z.object({
  cliente: z.object({
    nombre: z.string().min(2).max(100),
    email: z.string().email(),
    telefono: z.string().regex(/^[+\d\s\-()]{7,20}$/, 'Teléfono no válido'),
  }),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  hora: z.enum(['08:00','09:00','10:00','11:00','12:00','13:00','13:30']),
  lineasTortilla: z.array(z.object({
    saborId: z.string(),
    tamaño: z.enum(['mediana', 'grande']),
    cantidad: z.number().int().min(1).max(50),
  })).min(0),
  lineasCroqueta: z.array(z.object({
    pack: z.union([z.literal(6), z.literal(12)]),
    cantidad: z.number().int().min(1).max(20),
  })).min(0),
  notas: z.string().max(500).optional(),
}).refine(
  data => data.lineasTortilla.length + data.lineasCroqueta.length > 0,
  { message: 'El encargo debe tener al menos un producto' }
)
```

#### Validación de fecha (regla 48h)

```typescript
import { toZonedTime, fromZonedTime } from 'date-fns-tz'
import { addDays, addHours, parseISO, isBefore, isAfter } from 'date-fns'

const TZ = 'Europe/Madrid'

function validarFechaEncargo(fecha: string, hora: string): string | null {
  const ahora = toZonedTime(new Date(), TZ)
  const minima = addHours(ahora, 48)
  const maxima = addDays(ahora, 30)

  const fechaRecogida = parseISO(`${fecha}T${hora}:00`)
  const fechaRecogidaMadrid = fromZonedTime(fechaRecogida, TZ)

  if (isBefore(fechaRecogidaMadrid, minima)) return 'La fecha debe ser al menos 48h en el futuro'
  if (isAfter(fechaRecogidaMadrid, maxima)) return 'La fecha no puede ser más de 30 días en el futuro'
  return null
}
```

#### Cálculo de total (servidor)

```typescript
async function calcularLineas(input: CrearEncargoInput, sabores: Sabor[]) {
  const lineasTortilla: LineaTortilla[] = []
  for (const l of input.lineasTortilla) {
    const sabor = sabores.find(s => s.id === l.saborId && s.activo && !s.esTemporada)
    if (!sabor) throw new Error(`Sabor no válido: ${l.saborId}`)
    const precioUnitario = l.tamaño === 'grande'
      ? (sabor.precioGrande ?? sabor.precio * 1.8)
      : sabor.precio
    lineasTortilla.push({
      saborId: l.saborId,
      nombre: sabor.nombre,
      tamaño: l.tamaño,
      cantidad: l.cantidad,
      precioUnitario,
      subtotal: precioUnitario * l.cantidad,
    })
  }
  const lineasCroqueta: LineaCroqueta[] = input.lineasCroqueta.map(l => ({
    pack: l.pack,
    cantidad: l.cantidad,
    precioUnitario: PRECIO_CROQUETAS[l.pack],
    subtotal: PRECIO_CROQUETAS[l.pack] * l.cantidad,
  }))
  const total = [
    ...lineasTortilla.map(l => l.subtotal),
    ...lineasCroqueta.map(l => l.subtotal),
  ].reduce((a, b) => a + b, 0)

  return { lineasTortilla, lineasCroqueta, total }
}
```

#### Responses

```
201 Created  → CrearEncargoResponse
400 Bad Request → ErrorResponse { code: 'ENCARGO_INVALIDO' | 'FECHA_ENCARGO_INVALIDA' | 'VALIDACION' }
500 Internal → ErrorResponse { code: 'INTERNO' }
```

#### Estructura de `lib/encargos.ts`

```typescript
// lib/encargos.ts
export async function crearEncargo(input: unknown): Promise<CrearEncargoResponse>
  // 1. Validar schema Zod
  // 2. Obtener sabores de Edge Config
  // 3. Validar fecha (regla 48h)
  // 4. Calcular líneas y total en servidor
  // 5. Construir objeto Encargo con id y estado 'pendiente'
  // 6. Guardar en KV
  // 7. Enviar emails (admin + cliente)
  // 8. Devolver respuesta

export async function enviarEmailsEncargo(encargo: Encargo): Promise<void>
  // Llama a Resend con dos emails en paralelo
```

---

## 5. Wizard — flujo y estado

### Etapas

```
[catalogo] → [resumen] → [datos] → [confirmacion]
```

| Etapa | Componente | Descripción |
|-------|-----------|-------------|
| `catalogo` | `CatalogoPedido` | Seleccionar tortillas + croquetas. Resumen sticky a la derecha |
| `resumen` | `ResumenEncargo` | Vista de solo lectura del carrito antes de introducir datos |
| `datos` | `FormDatosContacto` + `PickerFechaEncargo` + `PickerHoraEncargo` | Formulario de cliente y fecha/hora de recogida |
| `confirmacion` | `ConfirmacionEncargo` | ID de encargo, tabla resumen, WhatsApp, .ics |

### Shape del estado del wizard

```typescript
// En EncargoWizard.tsx
type Etapa = 'catalogo' | 'resumen' | 'datos' | 'confirmacion'

interface CarritoLineTortilla {
  saborId: string
  nombre: string
  tamaño: TamañoTortilla
  cantidad: number
}

interface CarritoLineCroqueta {
  pack: 6 | 12
  cantidad: number
}

interface WizardState {
  etapa: Etapa
  lineasTortilla: CarritoLineTortilla[]
  lineasCroqueta: CarritoLineCroqueta[]
  cliente: {
    nombre: string
    email: string
    telefono: string
  }
  fecha: string    // '' hasta que se seleccione
  hora: string     // '' hasta que se seleccione
  notas: string
  enviando: boolean
  encargoConfirmado: Encargo | null
  error: string | null
}

const initialState: WizardState = {
  etapa: 'catalogo',
  lineasTortilla: [],
  lineasCroqueta: [],
  cliente: { nombre: '', email: '', telefono: '' },
  fecha: '',
  hora: '',
  notas: '',
  enviando: false,
  encargoConfirmado: null,
  error: null,
}
```

### Actions del reducer

```typescript
type WizardAction =
  | { type: 'SET_CANTIDAD_TORTILLA'; saborId: string; tamaño: TamañoTortilla; cantidad: number }
  | { type: 'SET_CANTIDAD_CROQUETA'; pack: 6 | 12; cantidad: number }
  | { type: 'IR_A_ETAPA'; etapa: Etapa }
  | { type: 'SET_CLIENTE'; cliente: WizardState['cliente'] }
  | { type: 'SET_FECHA'; fecha: string }
  | { type: 'SET_HORA'; hora: string }
  | { type: 'SET_NOTAS'; notas: string }
  | { type: 'ENVIAR_START' }
  | { type: 'ENVIAR_OK'; encargo: Encargo }
  | { type: 'ENVIAR_ERROR'; error: string }
```

### Helpers derivados del estado

```typescript
// Total estimado (para mostrar en UI, el servidor recalcula)
function calcularTotalEstimado(state: WizardState, sabores: Sabor[]): number

// ¿Puede avanzar de catálogo a resumen?
function puedeAvanzar(state: WizardState): boolean {
  return state.lineasTortilla.some(l => l.cantidad > 0) ||
         state.lineasCroqueta.some(l => l.cantidad > 0)
}
```

---

## 6. Árbol de componentes

```
app/encargo/page.tsx (Server Component)
  → Comprueba isEncargosEnabled() → redirect('/') si false
  → Obtiene sabores de getSabores()
  → Renderiza <EncargoWizard sabores={sabores} />

components/encargo/
  ├── EncargoWizard.tsx         (Client, 'use client')
  │   ├── useReducer(wizardReducer, initialState)
  │   ├── Etapa 'catalogo'  → <CatalogoPedido />
  │   ├── Etapa 'resumen'   → <ResumenConfirmacion />
  │   ├── Etapa 'datos'     → <FormDatosYFecha />
  │   └── Etapa 'confirmacion' → <ConfirmacionEncargo />
  │
  ├── CatalogoPedido.tsx        (recibe sabores, dispatch, state)
  │   ├── Para cada sabor → <TortillaLineaCard />
  │   ├── <CroquetaLineaCard />
  │   └── (mobile) → <CartDrawerMobile /> (fixed bottom)
  │
  ├── TortillaLineaCard.tsx     (un sabor, tamaño toggle, stepper)
  │   ├── Toggle mediana/grande → dispatch SET_CANTIDAD_TORTILLA
  │   └── Stepper +/- cantidad → dispatch SET_CANTIDAD_TORTILLA
  │
  ├── CroquetaLineaCard.tsx     (packs 6 y 12 independientes)
  │   └── Stepper por pack → dispatch SET_CANTIDAD_CROQUETA
  │
  ├── ResumenLateral.tsx        (sticky derecha en desktop)
  │   ├── Lista de líneas con subtotales
  │   ├── Total estimado
  │   └── Botón "Siguiente" → dispatch IR_A_ETAPA('resumen')
  │
  ├── CartDrawerMobile.tsx      (fixed bottom, solo mobile)
  │   ├── Total + número de items
  │   └── Botón "Ver encargo" → abre drawer completo
  │
  ├── ResumenConfirmacion.tsx   (etapa resumen — solo lectura)
  │   ├── Tabla de líneas
  │   ├── Total
  │   ├── Botón "Atrás" → IR_A_ETAPA('catalogo')
  │   └── Botón "Introducir datos" → IR_A_ETAPA('datos')
  │
  ├── FormDatosYFecha.tsx       (etapa datos — shell que agrupa)
  │   ├── <FormDatosContacto />
  │   ├── <PickerFechaEncargo />
  │   ├── <PickerHoraEncargo />
  │   ├── <textarea> para notas (opcional)
  │   └── Botón "Confirmar encargo" → submit → ENVIAR_START → fetch POST /api/encargos
  │
  ├── FormDatosContacto.tsx     (nombre, email, teléfono con validación)
  │
  ├── PickerFechaEncargo.tsx    (calendario, desde hoy+2d, máx 30d)
  │   └── Mismo estilo visual que CalendarioSemana.tsx
  │
  ├── PickerHoraEncargo.tsx     (radio group de 7 slots)
  │   └── 08:00 | 09:00 | 10:00 | 11:00 | 12:00 | 13:00 | 13:30
  │
  └── ConfirmacionEncargo.tsx   (etapa final)
      ├── ID del encargo (enc_xxxx)
      ├── Tabla resumen del pedido
      ├── Fecha y hora de recogida
      ├── Dirección del local
      ├── Botón WhatsApp deep link
      └── Botón descargar .ics (calendario)
```

### Notas de implementación de componentes

**TortillaLineaCard**: el toggle mediana/grande no resetea la cantidad. Si estás en mediana=2 y cambias a grande, el estado guarda `{ saborId, tamaño: 'grande', cantidad: 2 }`. El stepper muestra la cantidad actual del tamaño seleccionado.

**PickerFechaEncargo**: no importar CalendarioSemana directamente (está acoplado a reservas). Crear uno nuevo con la misma paleta de colores. Las fechas bloqueadas son:
- Hoy y mañana (regla 48h)
- Días con más de 30 días de distancia

**CartDrawerMobile**: usar Framer Motion `AnimatePresence` + `motion.div` con `y` de 100% a 0. El botón de cierre en el header del drawer.

**ResumenLateral**: `position: sticky; top: 1.5rem`. En mobile se oculta (`hidden md:block`). En su lugar aparece `CartDrawerMobile`.

---

## 7. Emails

Ambos emails se envían en paralelo tras guardar el encargo en KV.

### Configuración Resend

```typescript
// lib/encargos.ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'Café & Tortilla Montes <encargos@tortillasmontes.es>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'montes@ejemplo.com'
```

### Email admin

**Subject**: `Nuevo encargo — {nombre} · {fecha formateada} {hora}`

**Contenido**:
```
[NUEVO ENCARGO - enc_xxxx]

Cliente: {nombre}
Teléfono: {telefono} (enlace tel:)
Email: {email}
Recogida: {fecha larga}, {hora}

─────────────────────────────────────
Producto          | Variante | Uds | Subtotal
─────────────────────────────────────
Clásica con Ceb.  | Mediana  |  2  | 16,00 €
Jamón y Queso     | Grande   |  1  | 18,50 €
Croquetas jamón   | Pack 12  |  2  | 24,00 €
─────────────────────────────────────
TOTAL                              58,50 €

Notas: {notas o "—"}
```

### Email cliente

**Subject**: `¡Encargo confirmado! Recogida el {fecha formateada}`

**Contenido**:
```
Hola {nombre},

Tu encargo está confirmado. Te esperamos el {fecha larga} a las {hora}.

[tabla resumen igual que admin]

📍 Dónde recogemos:
   Café & Tortilla Montes
   Calle [dirección], San Agustín de Guadalix

📞 Cualquier consulta:
   +34 633 771 163

Tu número de encargo: enc_xxxx

¡Hasta pronto!
```

### Implementación

```typescript
// Ambos en paralelo, el fallo de email NO debe fallar la creación del encargo
async function enviarEmailsEncargo(encargo: Encargo): Promise<void> {
  try {
    await Promise.all([
      resend.emails.send({ from: FROM_EMAIL, to: ADMIN_EMAIL, subject: ..., html: ... }),
      resend.emails.send({ from: FROM_EMAIL, to: encargo.cliente.email, subject: ..., html: ... }),
    ])
  } catch (err) {
    console.error('Error enviando emails de encargo:', err)
    // No propagar el error — el encargo ya está guardado
  }
}
```

---

## 8. Reglas de negocio

| Regla | Valor | Dónde validar |
|-------|-------|--------------|
| Antelación mínima | 48h | Servidor (lib/encargos.ts) + UI (deshabilitar fechas) |
| Antelación máxima | 30 días | Servidor + UI |
| Slots de hora | 08:00–13:30 (cada hora + 13:30) | Servidor (z.enum) + UI |
| Cantidad tortilla | 1–50 por línea | Servidor (z.number.min(1).max(50)) |
| Cantidad croquetas | 1–20 packs | Servidor (z.number.min(1).max(20)) |
| Mínimo del encargo | ≥1 producto | Servidor (.refine) + UI (deshabilitar botón) |
| Notas | max 500 chars | Servidor (z.string.max(500)) |
| Precios croquetas | Pack 6 = 6€, Pack 12 = 12€ | Solo servidor (PRECIO_CROQUETAS) |
| Precios tortilla | precio (mediana) / precioGrande (grande) | Solo servidor, desde Edge Config |
| Tortillas de temporada | `esTemporada: true` → no disponibles en encargos | Servidor + UI (no mostrar) |
| Horario de creación | Sin restricción (24h) | No hay validación de horario |
| Stock | Sin límite (no descuenta KV de reservas) | N/A |

---

## 9. Checklist de implementación

### Fase 2A — Fontanería (sin UI visible)

- [ ] `lib/types.ts` — añadir `TamañoTortilla`, `LineaTortilla`, `LineaCroqueta`, `EstadoEncargo`, `Encargo`, `CrearEncargoInput`, `CrearEncargoResponse`
- [ ] `lib/kv.ts` — añadir `PRECIO_CROQUETAS`, `SLOTS_HORA_ENCARGO`, `guardarEncargo()`, `getEncargo()`, `getEncargosPorFecha()`
- [ ] `lib/encargos.ts` — crear: schema Zod, `validarFechaEncargo()`, `calcularLineas()`, `crearEncargo()`, `enviarEmailsEncargo()`
- [ ] `app/api/encargos/route.ts` — Edge Runtime, POST handler, llamar a `crearEncargo()`
- [ ] Probar con `curl` o Postman antes de construir UI

### Fase 2B — Cart UI

- [ ] `components/encargo/EncargoWizard.tsx` — shell + `useReducer` + routing de etapas
- [ ] `components/encargo/TortillaLineaCard.tsx` — card con toggle tamaño + stepper
- [ ] `components/encargo/CroquetaLineaCard.tsx` — card con steppers por pack
- [ ] `components/encargo/CatalogoPedido.tsx` — columna izquierda (lista de cards)
- [ ] `components/encargo/ResumenLateral.tsx` — columna derecha sticky
- [ ] `components/encargo/CartDrawerMobile.tsx` — cajón móvil con Framer Motion
- [ ] `app/encargo/page.tsx` — sustituir placeholder por `<EncargoWizard sabores={sabores} />`
- [ ] Verificar que DemoSwitch ON muestra la página con el wizard real

### Fase 2C — Form + Confirmación

- [ ] `components/encargo/ResumenConfirmacion.tsx` — etapa resumen (solo lectura)
- [ ] `components/encargo/FormDatosContacto.tsx` — nombre, email, teléfono
- [ ] `components/encargo/PickerFechaEncargo.tsx` — calendario con bloqueos
- [ ] `components/encargo/PickerHoraEncargo.tsx` — radio group de slots
- [ ] `components/encargo/FormDatosYFecha.tsx` — shell de la etapa datos
- [ ] `components/encargo/ConfirmacionEncargo.tsx` — pantalla final con WhatsApp + .ics
- [ ] Integrar submit: `fetch POST /api/encargos` → dispatch ENVIAR_OK/ENVIAR_ERROR

### Fase 2D — Emails

- [ ] HTML email admin (tabla de líneas, total, teléfono clickable)
- [ ] HTML email cliente (resumen, dirección, teléfono del local)
- [ ] Probar en Resend sandbox
- [ ] Verificar que el fallo de email no rompe la creación del encargo

---

## 10. Guía para arrancar en otro equipo

### Requisitos previos

```bash
node >= 20
pnpm >= 9
```

### Setup inicial

```bash
git clone <repo>
cd montes
pnpm install

# Variables de entorno
vercel link          # Vincular al proyecto Vercel
vercel env pull      # Descargar .env.local con KV, Edge Config, Resend, etc.

# O manualmente en .env.local:
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
EDGE_CONFIG=...
RESEND_API_KEY=...
BLOB_READ_WRITE_TOKEN=...
FEATURE_ENCARGOS=true   # Para trabajar en Fase 2 localmente
```

### Activar Fase 2 en local

```bash
# .env.local
FEATURE_ENCARGOS=true
```

O usar el DemoSwitch en el navegador (esquina inferior derecha, 18% opacidad).

### Convenciones de código

- **No PowerShell** — usar CMD en Windows (GPO corporativa)
- **Edge Runtime** en API routes — no usar `fs`, `crypto` de Node
- **Precios en servidor** — nunca confiar en precios del cliente
- **Zod para validación** — tanto en servidor como en cliente (mismos schemas cuando sea posible)
- **Paleta de colores** — ver tabla en CLAUDE.md (fondo `#1A0E05`, oro `#DFA855`, etc.)
- **Commits** — sin línea Co-Authored-By en mensajes
- **pnpm** — usar pnpm, no npm, para no desincronizar el lockfile de Vercel

### Archivos clave para Fase 2

| Archivo | Rol |
|---------|-----|
| `lib/types.ts` | Añadir tipos de encargos (ver sección 2) |
| `lib/kv.ts` | Añadir funciones KV (ver sección 3) |
| `lib/encargos.ts` | Crear — toda la lógica de negocio |
| `app/api/encargos/route.ts` | Crear — POST handler Edge |
| `app/encargo/page.tsx` | Reemplazar placeholder por wizard |
| `components/encargo/` | Crear directorio con todos los componentes |
| `lib/features.ts` | No tocar — ya gestiona el flag correctamente |
| `middleware.ts` | No tocar — el matcher NO cubre encargos a propósito |

### Variables de entorno necesarias para Fase 2

| Variable | Propósito | Dónde obtenerla |
|----------|-----------|-----------------|
| `RESEND_API_KEY` | Envío de emails | resend.com → API Keys |
| `ADMIN_EMAIL` | Destinatario del email de admin | Definir en Vercel env vars |
| `KV_REST_API_URL` | Vercel KV | Dashboard Vercel → Storage → KV |
| `KV_REST_API_TOKEN` | Vercel KV auth | Dashboard Vercel → Storage → KV |
| `EDGE_CONFIG` | Sabores y config | Dashboard Vercel → Storage → Edge Config |

### Estado actual del repositorio

- `main` — rama principal, auto-deploy a Vercel
- Fase 1 completa y en producción
- `app/encargo/page.tsx` muestra placeholder ("Próximamente") cuando el flag está activo
- `components/encargo/EncargosCTA.tsx` — CTA visible en homepage cuando flag activo
- `DemoSwitch` funcional — cookie de 24h para alternar en demo

### Testar la API antes de empezar con UI

```bash
# Con el servidor corriendo (npm run dev):

# Crear encargo válido
curl -X POST http://localhost:3000/api/encargos \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": { "nombre": "Test", "email": "test@test.com", "telefono": "+34600000000" },
    "fecha": "2026-03-25",
    "hora": "10:00",
    "lineasTortilla": [{ "saborId": "clasica-con", "tamaño": "mediana", "cantidad": 2 }],
    "lineasCroqueta": []
  }'
# Esperado: 201 { ok: true, encargo: { id: "enc_...", ... } }

# Error: menos de 48h
curl -X POST http://localhost:3000/api/encargos \
  -H "Content-Type: application/json" \
  -d '{ ... "fecha": "2026-03-19" ... }'
# Esperado: 400 { ok: false, code: "FECHA_ENCARGO_INVALIDA" }
```
