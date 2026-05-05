export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: 'Mr Tortilla',
    description:
      'Tortillas de patata artesanales en 8 variedades, croquetas caseras de jamón, café y bollería. Calidad artesanal.',
    url: 'https://mrtortilla.es',
    telephone: '+34600367217',
    priceRange: '€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card',
    servesCuisine: ['Española', 'Desayunos', 'Tortilla de patata'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Madrid',
      addressRegion: 'Madrid',
      addressCountry: 'ES',
    },
    image: 'https://mrtortilla.es/tortilla-hero.webp',
    logo: 'https://mrtortilla.es/logo.png',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday',
          'Friday', 'Saturday', 'Sunday',
        ],
        opens: '07:00',
        closes: '14:00',
      },
    ],
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Dine-in',  value: false },
      { '@type': 'LocationFeatureSpecification', name: 'Takeout',  value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Delivery', value: false },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
