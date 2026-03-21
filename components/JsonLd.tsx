export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    name: 'Café & Tortilla Montes',
    description:
      'Tortillas de patata artesanales en 8 variedades, croquetas caseras de jamón, café y bollería. 4,7★ en Google. Recogida 07:00–14:00.',
    url: 'https://cafetortillamontes.es',
    telephone: '+34633771163',
    priceRange: '€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card',
    servesCuisine: ['Española', 'Desayunos', 'Tortilla de patata'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'C. Postas, 2',
      addressLocality: 'San Agustín de Guadalix',
      addressRegion: 'Madrid',
      postalCode: '28750',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 40.6779209,
      longitude: -3.616233,
    },
    hasMap: 'https://maps.app.goo.gl/QHTq71Unv4gcpj6b9',
    image: 'https://cafetortillamontes.es/tortilla-hero.webp',
    logo: 'https://cafetortillamontes.es/logo.png',
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '199',
      bestRating: '5',
      worstRating: '1',
    },
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Dine-in',  value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Takeout',  value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Delivery', value: false },
    ],
    sameAs: [
      'https://www.google.com/maps?cid=5239364515621535051',
      'https://maps.app.goo.gl/QHTq71Unv4gcpj6b9',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
