import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { JsonLd } from '@/components/JsonLd'
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

// ⚠️ Actualizar con el dominio real antes de lanzar
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cafetortillamontes.es'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'Café & Tortilla Montes — San Agustín de Guadalix',
    template: '%s | Café & Tortilla Montes',
  },
  description:
    'Café & Tortilla Montes en San Agustín de Guadalix. Tortillas de patata caseras en 8 variedades, croquetas de jamón, café y bollería. 4,7★ en Google. Recogida 07:00–14:00. C. Postas, 2.',

  keywords: [
    'tortilla de patata San Agustín de Guadalix',
    'tortilla artesanal Madrid norte',
    'café tortilla Montes',
    'desayuno San Agustín de Guadalix',
    'cafetería Montes',
    'croquetas caseras jamón',
    'bollería artesanal Madrid',
    'tortilla patata para llevar',
    'donde desayunar San Agustín Guadalix',
    'cafetería cerca de Madrid',
    'tortilla española casera',
    'bar desayunos Madrid norte',
  ],

  authors: [{ name: 'Café & Tortilla Montes' }],
  creator: 'Café & Tortilla Montes',
  publisher: 'Café & Tortilla Montes',

  alternates: {
    canonical: '/',
  },

  openGraph: {
    title: 'Café & Tortilla Montes — 4,7★ en Google',
    description:
      '8 sabores únicos de tortilla artesanal, croquetas de jamón, café y bollería. Stock limitado. C. Postas, 2 · San Agustín de Guadalix.',
    locale: 'es_ES',
    type: 'website',
    siteName: 'Café & Tortilla Montes',
    url: '/',
    images: [
      {
        url: '/tortilla-hero.webp',
        width: 1200,
        height: 630,
        alt: 'Tortilla de patata artesanal — Café & Tortilla Montes',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Café & Tortilla Montes — 4,7★ en Google',
    description:
      '8 sabores únicos de tortilla artesanal. C. Postas, 2 · San Agustín de Guadalix.',
    images: ['/tortilla-hero.webp'],
  },

  // Geo tags para SEO local
  other: {
    'geo.region':    'ES-MD',
    'geo.placename': 'San Agustín de Guadalix, Madrid',
    'geo.position':  '40.6779209;-3.616233',
    'ICBM':          '40.6779209, -3.616233',
    // Open Graph negocio local
    'business:contact_data:street_address': 'C. Postas, 2',
    'business:contact_data:locality':       'San Agustín de Guadalix',
    'business:contact_data:region':         'Madrid',
    'business:contact_data:postal_code':    '28750',
    'business:contact_data:country_name':   'España',
    'business:contact_data:phone_number':   '+34633771163',
    // Clasificación
    'og:type':         'restaurant',
    'restaurant:category': 'Cafetería',
  },

  icons: {
    icon:  '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [{ rel: 'icon', url: '/favicon-32.png', sizes: '32x32', type: 'image/png' }],
  },

  // ⚠️ noindex mientras la web no esté en producción
  // Cambiar a { index: true, follow: true } al lanzar
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#C47832',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <JsonLd />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
