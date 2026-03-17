import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Café y Tortilla Montes — San Agustín de Guadalix',
    template: '%s | Café y Tortilla Montes',
  },
  description:
    'Cafetería Montes en San Agustín del Guadalix. Tortillas de patata caseras en 6 variedades, croquetas de jamón, café y bollería. 4,7★ en Google. Recogida 07:00–14:00. C. Postas, 2.',
  keywords: ['tortilla', 'tortilla de patata', 'San Agustín de Guadalix', 'artesanal', 'reservas', 'cafetería', 'café Montes', 'croquetas', 'bollería', 'Madrid'],
  openGraph: {
    title: 'Café y Tortilla Montes — 4,7★ en Google',
    description: '8 sabores únicos, stock limitado. Reserva la tuya antes de que se agote. C. Postas, 2 · San Agustín del Guadalix.',
    locale: 'es_ES',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#C47832',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
