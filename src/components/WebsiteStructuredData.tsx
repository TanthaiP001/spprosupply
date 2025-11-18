const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://spprosupply.com';

export default function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SP Pro Supply',
    url: siteUrl,
    description: 'สินค้าสร้างสรรค์ นวัตกรรมสุขภาพ - เอส พี โปร ซัพพลาย ร้านค้าออนไลน์คุณภาพ',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

