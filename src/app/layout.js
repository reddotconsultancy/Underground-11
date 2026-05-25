import "./globals.css";

export const metadata = {
  title: "Underground 11 Coffee Bar — Specialty Coffee, Desserts & Late-Night Vibes",
  description: "Underground 11 Coffee Bar — specialty coffee, signature desserts, and premium late-night cafe energy. Explore our iconic menu and moody atmosphere.",
  keywords: [
    "Underground 11",
    "Coffee Bar",
    "Specialty Coffee Mangalore",
    "Late Night Cafe Mangaluru",
    "Desserts Mangalore",
    "Best Cafe in Mangaluru",
    "Cafe Airport Road Yeyyadi",
    "Local Cafe Mangalore",
    "Underground Cafe",
    "Coffee Shop Mangaluru"
  ],
  authors: [{ name: "Underground 11" }],
  creator: "Underground 11",
  publisher: "Underground 11",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Underground 11 Coffee Bar — Specialty Coffee & Late-Night Vibes",
    description: "Underground 11 Coffee Bar — specialty coffee, signature desserts, and premium late-night cafe energy. Explore our iconic menu and moody atmosphere.",
    url: "https://underground-11.vercel.app",
    siteName: "Underground 11 Coffee Bar",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://underground-11.vercel.app/assets/logo.jpg",
        width: 800,
        height: 800,
        alt: "Underground 11 Coffee Bar Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Underground 11 Coffee Bar",
    description: "Specialty coffee, signature desserts & premium late-night vibes in Mangaluru.",
    images: ["https://underground-11.vercel.app/assets/logo.jpg"]
  }
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Cafe",
    "name": "Underground 11 Coffee Bar",
    "image": "https://underground-11.vercel.app/assets/logo.jpg",
    "@id": "https://underground-11.vercel.app",
    "url": "https://underground-11.vercel.app",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ground Floor, Mindspace Building, Airport Road, Yeyyadi",
      "addressLocality": "Mangaluru",
      "addressRegion": "Karnataka",
      "postalCode": "575008",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 12.923483,
      "longitude": 74.862412
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
        "opens": "09:00",
        "closes": "01:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Friday", "Saturday"],
        "opens": "09:00",
        "closes": "03:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "10:00",
        "closes": "23:00"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/underground11_coffeebar"
    ]
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;0,900;1,500;1,700&family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
