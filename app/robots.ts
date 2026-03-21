import type { MetadataRoute } from 'next'

// ⚠️ Todos los crawlers bloqueados — activar cuando la web esté en producción:
// Cambiar disallow: '/' por allow: '/' y descomentar sitemap
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
    // sitemap: 'https://cafetortillamontes.es/sitemap.xml',
  }
}
