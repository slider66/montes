import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: {
    default: 'Montes — La mejor tortilla de San Agustín de Guadalix',
    template: '%s | Montes',
  },
  description:
    'Reserva tu tortilla artesanal. 8 sabores únicos, stock limitado. Recogida de 07:00 a 14:00.',
  keywords: ['tortilla', 'San Agustín de Guadalix', 'artesanal', 'reservas', 'cafetería'],
  openGraph: {
    title: 'Montes — Tortillas Artesanales',
    description: 'Stock limitado. Reserva la tuya antes de que se agote.',
    locale: 'es_ES',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#e8a020',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
