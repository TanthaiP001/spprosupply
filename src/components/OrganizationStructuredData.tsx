const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://spprosupply.com';

export default function OrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SP Pro Supply',
    url: siteUrl,
    logo: `${siteUrl}/logo/logo.png`,
    description: 'สินค้าสร้างสรรค์ นวัตกรรมสุขภาพ - เอส พี โปร ซัพพลาย',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['Thai'],
    },
    sameAs: [
      // Add your social media links here
      // 'https://www.facebook.com/spprosupply',
      // 'https://www.instagram.com/spprosupply',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

