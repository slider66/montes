'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CartLinea } from './EncargoWizard'
import { ResumenEncargo } from './ResumenEncargo'

interface Props {
  lineas: CartLinea[]
  total: number
  totalUds: number
  onSiguiente: () => void
}

export function CartDrawerMobile({ lineas, total, totalUds, onSiguiente }: Props) {
  const [open, setOpen] = useState(false)

  // No mostrar nada si el carrito está vacío
  if (totalUds === 0) return null

  return (
    <>
      {/* ── Floating bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden px-4 pb-5 pt-2">
        <motion.button
          onClick={() => setOpen(true)}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full flex items-center justify-between px-5 py-4 rounded-2xl shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #D4893A 0%, #EAB85A 100%)',
            boxShadow: '0 8px 32px rgba(212,137,58,0.45)',
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black tabular-nums"
              style={{ background: 'rgba(0,0,0,0.18)', color: '#1A0E05' }}
            >
              {totalUds}
            </span>
            <span className="font-bold text-sm" style={{ color: '#1A0E05' }}>
              Ver pedido
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-base tabular-nums" style={{ color: '#1A0E05' }}>
              {total.toFixed(2)} €
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              style={{ color: '#1A0E05' }}
            >
              <path
                d="M7 11V3M3 7l4-4 4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.button>
      </div>

      {/* ── Drawer ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden rounded-t-3xl overflow-hidden"
              style={{ background: '#1A0E05', maxHeight: '88dvh' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div
                  className="w-10 h-1 rounded-full"
                  style={{ background: 'rgba(196,120,50,0.3)' }}
                />
              </div>

              {/* Botón cerrar */}
              <div className="flex justify-end px-5 pt-1 pb-2">
                <button
                  onClick={() => setOpen(false)}
                  className="text-xs py-1 px-3 rounded-lg transition-opacity hover:opacity-70"
                  style={{ color: 'rgba(250,240,220,0.4)', background: 'rgba(196,120,50,0.08)' }}
                >
                  Cerrar ✕
                </button>
              </div>

              {/* Contenido */}
              <div
                className="px-5 pb-8 overflow-y-auto"
                style={{ maxHeight: 'calc(88dvh - 80px)' }}
              >
                <ResumenEncargo
                  lineas={lineas}
                  total={total}
                  onSiguiente={() => {
                    setOpen(false)
                    onSiguiente()
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
