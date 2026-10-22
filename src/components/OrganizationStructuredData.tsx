import JsonLd from "@/components/JsonLd";
import { FACEBOOK_URL, SITE_LOGO_PATH, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

export default function OrganizationStructuredData() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: "เอส พี โปร ซัพพลาย",
        url: SITE_URL,
        logo: absoluteUrl(SITE_LOGO_PATH),
        email: "spprosupply@gmail.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "164/1 หมู่ 5 ตำบลโคกคราม",
          addressLocality: "อำเภอบางปลาม้า",
          addressRegion: "สุพรรณบุรี",
          postalCode: "72150",
          addressCountry: "TH",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+66-81-011-6699",
          contactType: "customer service",
          availableLanguage: ["th"],
        },
        sameAs: [FACEBOOK_URL],
      }}
    />
  );
}
