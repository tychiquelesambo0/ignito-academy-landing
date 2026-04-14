import type { Metadata } from "next"
import { Inter, Crimson_Pro } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/LanguageContext"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-serif",
})

const BASE_URL = "https://ignitoacademy.com"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Ignito Academy — Licence Britannique depuis la RDC",
    template: "%s | Ignito Academy",
  },
  description:
    "Obtenez votre Licence Britannique (Bachelor's Degree) en 4 ans, 100 % en ligne depuis Kinshasa. Cursus reconnu par le cadre britannique RQF. Débutez après votre Diplôme d'État — sans frais de visa ni de voyage.",

  keywords: [
    "Ignito Academy",
    "licence britannique RDC",
    "bachelor degree en ligne Kinshasa",
    "université britannique à distance Congo",
    "formation supérieure RDC en ligne",
    "diplôme britannique sans visa",
    "études supérieures Kinshasa",
    "RQF Congo",
    "programme préparatoire britannique",
    "admissions Ignito Academy",
  ],

  authors: [{ name: "Ignito Academy", url: BASE_URL }],
  creator: "Ignito Academy",
  publisher: "Ignito Academy",

  alternates: {
    canonical: BASE_URL,
    languages: {
      "fr": BASE_URL,
      "en": `${BASE_URL}?lang=en`,
    },
  },

  openGraph: {
    type: "website",
    locale: "fr_CD",
    alternateLocale: "en_GB",
    url: BASE_URL,
    siteName: "Ignito Academy",
    title: "Ignito Academy — Licence Britannique depuis la RDC",
    description:
      "Obtenez votre Licence Britannique en 4 ans, 100 % en ligne depuis Kinshasa. Cursus aligné sur le cadre britannique RQF. Commencez après votre Diplôme d'État.",
    images: [
      {
        url: "/ignito-logo.svg",
        width: 1200,
        height: 630,
        alt: "Ignito Academy — Licence Britannique depuis la RDC",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ignito Academy — Licence Britannique depuis la RDC",
    description:
      "Obtenez votre Licence Britannique en 4 ans, 100 % en ligne depuis Kinshasa. Aucun visa requis.",
    images: ["/ignito-logo.svg"],
    creator: "@IgnitoAcademy",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  category: "education",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        {/* JSON-LD structured data — EducationalOrganization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Ignito Academy",
              url: BASE_URL,
              logo: `${BASE_URL}/ignito-logo.svg`,
              description:
                "Institution d'enseignement supérieur proposant des Licences Britanniques (Bachelor's Degree) 100 % en ligne depuis la République Démocratique du Congo.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Kinshasa",
                addressCountry: "CD",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "admissions",
                email: "admissions@ignitoacademy.com",
                url: "https://admissions.ignitoacademy.com/apply",
                availableLanguage: ["French", "English"],
              },
              sameAs: [],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Programmes d'études",
                itemListElement: [
                  {
                    "@type": "Course",
                    name: "Année Préparatoire — UK Level 3 Foundation Diploma",
                    description:
                      "Première année du cursus de 4 ans menant à la Licence Britannique. Accessible après le Diplôme d'État congolais.",
                    provider: {
                      "@type": "EducationalOrganization",
                      name: "Ignito Academy",
                    },
                    courseMode: "online",
                    educationalLevel: "Level 3 (RQF)",
                    inLanguage: ["fr", "en"],
                  },
                  {
                    "@type": "Course",
                    name: "Licence Britannique (Bachelor's Degree)",
                    description:
                      "Diplôme de niveau universitaire reconnu selon le cadre d'excellence britannique (RQF). Obtenu en 4 ans depuis la RDC, sans visa.",
                    provider: {
                      "@type": "EducationalOrganization",
                      name: "Ignito Academy",
                    },
                    courseMode: "online",
                    educationalLevel: "Level 6 (RQF)",
                    inLanguage: ["fr", "en"],
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${crimsonPro.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
