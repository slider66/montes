'use client'

import { useReducer, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Sabor, Encargo } from '@/lib/types'
import { CatalogoPedido } from './CatalogoPedido'
import { ResumenEncargo } from './ResumenEncargo'
import { CartDrawerMobile } from './CartDrawerMobile'
import { StepDatos } from './StepDatos'
import { ConfirmacionEncargo } from './ConfirmacionEncargo'

// ─── Cart State ───────────────────────────────────────────────────────────────

export interface CartLinea {
  saborId: string
  nombreSabor: string
  tamano: 'mediana' | 'grande'
  cantidad: number
  precioUnitario: number
  subtotal: number
}

type CartState = {
  lineas: Record<string, CartLinea> // key: `${saborId}_${tamano}`
  stage: number
}

type CartAction =
  | {
      type: 'SET_CANTIDAD'
      saborId: string
      nombre: string
      tamano: 'mediana' | 'grande'
      cantidad: number
      precio: number
    }
  | { type: 'SET_STAGE'; stage: number }
  | { type: 'RESET' }

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CANTIDAD': {
      const key = `${action.saborId}_${action.tamano}`
      if (action.cantidad <= 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _removed, ...rest } = state.lineas
        return { ...state, lineas: rest }
      }
      return {
        ...state,
        lineas: {
          ...state.lineas,
          [key]: {
            saborId: action.saborId,
            nombreSabor: action.nombre,
            tamano: action.tamano,
            cantidad: action.cantidad,
            precioUnitario: action.precio,
            subtotal: Math.round(action.precio * action.cantidad * 100) / 100,
          },
        },
      }
    }
    case 'SET_STAGE':
      return { ...state, stage: action.stage }
    case 'RESET':
      return { lineas: {}, stage: 0 }
    default:
      return state
  }
}

// ─── Progress Steps ───────────────────────────────────────────────────────────

const STEPS = ['Catálogo', 'Resumen', 'Datos', 'Confirmación']

function ProgressSteps({ stage }: { stage: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
              style={{
                background:
                  i < stage
                    ? 'rgba(212,137,58,0.6)'
                    : i === stage
                    ? 'linear-gradient(135deg,#D4893A,#EAB85A)'
                    : 'rgba(196,120,50,0.1)',
                color: i <= stage ? '#1A0E05' : 'rgba(250,240,220,0.3)',
                border:
                  i === stage
                    ? 'none'
                    : `1px solid ${i < stage ? 'rgba(212,137,58,0.4)' : 'rgba(196,120,50,0.18)'}`,
              }}
            >
              {i < stage ? '✓' : i + 1}
            </div>
            <span
              className="text-[10px] uppercase tracking-wide hidden sm:block"
              style={{ color: i === stage ? '#EAB85A' : 'rgba(250,240,220,0.3)' }}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="w-8 sm:w-12 h-px mx-1 mb-4 transition-all duration-300"
              style={{ background: i < stage ? 'rgba(212,137,58,0.5)' : 'rgba(196,120,50,0.15)' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Wizard ───────────────────────────────────────────────────────────────────

export function EncargoWizard({ sabores }: { sabores: Sabor[] }) {
  const [state, dispatch] = useReducer(reducer, { lineas: {}, stage: 0 })
  const [encargoConfirmado, setEncargoConfirmado] = useState<Encargo | null>(null)

  const lineasArray = Object.values(state.lineas)
  const total = lineasArray.reduce((s, l) => s + l.subtotal, 0)
  const totalUds = lineasArray.reduce((s, l) => s + l.cantidad, 0)

  const setStage = (stage: number) => dispatch({ type: 'SET_STAGE', stage })

  const setCantidad = (
    saborId: string,
    nombre: string,
    tamano: 'mediana' | 'grande',
    cantidad: number,
    precio: number
  ) => dispatch({ type: 'SET_CANTIDAD', saborId, nombre, tamano, cantidad, precio })

  const handleConfirmado = (encargo: Encargo) => {
    setEncargoConfirmado(encargo)
    setStage(3)
  }

  return (
    <div className="min-h-screen" style={{ background: '#1A0E05' }}>
      {/* ── Header ── */}
      <div className="max-w-6xl mx-auto px-5 pt-10 pb-2">
        {state.stage < 3 && (
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs mb-8 transition-opacity hover:opacity-70"
            style={{ color: 'rgba(250,240,220,0.45)' }}
          >
            ← Volver al inicio
          </a>
        )}

        <div className="text-center mb-2">
          <p
            className="text-[10px] uppercase tracking-[0.25em] font-bold mb-2"
            style={{ color: 'rgba(212,137,58,0.55)' }}
          >
            Café &amp; Tortilla Montes
          </p>
          <h1
            className="font-display font-black italic text-4xl sm:text-5xl"
            style={{ color: '#FAF0DC' }}
          >
            Encargos
          </h1>
          {state.stage < 3 && (
            <p className="text-sm mt-2" style={{ color: 'rgba(250,240,220,0.45)' }}>
              Recogida en local · Mínimo 48h de antelación
            </p>
          )}
        </div>
      </div>

      {/* ── Progress ── */}
      <div className="max-w-6xl mx-auto px-5 pt-6">
        <ProgressSteps stage={state.stage} />
      </div>

      {/* ── Stage Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.stage}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Stage 0: Catálogo */}
          {state.stage === 0 && (
            <div className="max-w-6xl mx-auto px-5 pb-32 lg:pb-16 flex gap-8 items-start">
              <div className="flex-1 min-w-0">
                <CatalogoPedido
                  sabores={sabores}
                  lineas={state.lineas}
                  onSetCantidad={setCantidad}
                />
              </div>
              <div className="hidden lg:block w-80 shrink-0 sticky top-6">
                <ResumenEncargo
                  lineas={lineasArray}
                  total={total}
                  onSiguiente={() => setStage(1)}
                  esSidebar
                />
              </div>
            </div>
          )}

          {/* Stage 1: Resumen */}
          {state.stage === 1 && (
            <div className="max-w-xl mx-auto px-5 pb-16">
              <ResumenEncargo
                lineas={lineasArray}
                total={total}
                onSiguiente={() => setStage(2)}
                onEditar={() => setStage(0)}
              />
            </div>
          )}

          {/* Stage 2: Datos + fecha + hora */}
          {state.stage === 2 && (
            <div className="max-w-xl mx-auto px-5 pb-16">
              <StepDatos
                lineas={lineasArray}
                total={total}
                onSuccess={handleConfirmado}
                onBack={() => setStage(1)}
              />
            </div>
          )}

          {/* Stage 3: Confirmación */}
          {state.stage === 3 && encargoConfirmado && (
            <div className="max-w-xl mx-auto px-5 pb-16">
              <ConfirmacionEncargo encargo={encargoConfirmado} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Mobile cart drawer — solo en stage 0 */}
      {state.stage === 0 && (
        <CartDrawerMobile
          lineas={lineasArray}
          total={total}
          totalUds={totalUds}
          onSiguiente={() => setStage(1)}
        />
      )}
    </div>
  )
}
