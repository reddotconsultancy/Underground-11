import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://ground-11.vercel.app"),
  title: {
    default: "Underground 11 Coffee Bar — Specialty Coffee & Handcrafted Brews in Mangaluru",
    template: "%s | Underground 11 Coffee Bar"
  },
  description:
    "Underground 11 Coffee Bar in Mangaluru — specialty coffee, freshly baked pastries, artisanal desserts, signature cold brews, and curated lofi vibes. Visit us at Airport Road, Yeyyadi.",
  keywords: [
    "Underground 11",
    "Underground 11 Coffee Bar",
    "Specialty Coffee Mangalore",
    "Best Cafe Mangaluru",
    "Coffee Bar Mangalore",
    "Late Night Cafe Mangaluru",
    "Desserts Mangalore",
    "Cafe Airport Road Yeyyadi",
    "Cold Brew Mangaluru",
    "Pastries Mangalore",
    "Lofi Cafe Mangaluru",
    "Cozy Cafe Mangaluru",
    "Coffee Shop Mangaluru",
    "Best Coffee Mangaluru",
    "Evening Hangout Mangaluru",
    "Handcrafted Brews Mangalore",
    "Artisan Coffee Mangaluru",
    "Cafe near Airport Road Mangalore",
    "Underground Cafe",
    "Merch Coffee Bar Mangaluru"
  ],
  authors: [{ name: "Underground 11 Coffee Bar", url: "https://ground-11.vercel.app" }],
  creator: "Underground 11 Coffee Bar",
  publisher: "Underground 11 Coffee Bar",
  category: "Restaurant, Cafe, Coffee Shop",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://ground-11.vercel.app",
  },
  openGraph: {
    title: "Underground 11 Coffee Bar — Specialty Coffee & Handcrafted Brews",
    description:
      "Underground 11 Coffee Bar in Mangaluru — specialty coffee, signature desserts, and a cozy lofi atmosphere. Explore our iconic menu and underground vibes.",
    url: "https://ground-11.vercel.app",
    siteName: "Underground 11 Coffee Bar",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://ground-11.vercel.app/assets/hero_bg.png",
        width: 1200,
        height: 630,
        alt: "Underground 11 Coffee Bar — Specialty Coffee in Mangaluru",
      },
      {
        url: "https://ground-11.vercel.app/assets/logo.jpg",
        width: 800,
        height: 800,
        alt: "Underground 11 Coffee Bar Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Underground 11 Coffee Bar | Specialty Coffee Mangaluru",
    description:
      "Specialty coffee, signature desserts & handcrafted brews in Mangaluru. Visit us at Airport Road, Yeyyadi.",
    images: ["https://ground-11.vercel.app/assets/hero_bg.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/png", sizes: "any" },
    ],
    apple: [
      { url: "/assets/logo.jpg", sizes: "180x180", type: "image/jpeg" },
    ],
    shortcut: "/assets/logo.jpg",
    other: [
      {
        rel: "mask-icon",
        url: "/assets/logo.jpg",
      },
    ],
  },
  verification: {
    google: "",
  },
  other: {
    "theme-color": "#070708",
    "msapplication-TileColor": "#070708",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Underground 11",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": "https://ground-11.vercel.app/#cafe",
    "name": "Underground 11 Coffee Bar",
    "alternateName": "Underground 11",
    "description":
      "Specialty coffee bar in Mangaluru offering handcrafted brews, freshly baked pastries, artisanal desserts, and a curated lofi music atmosphere.",
    "image": [
      "https://ground-11.vercel.app/assets/hero_bg.png",
      "https://ground-11.vercel.app/assets/logo.jpg",
    ],
    "logo": "https://ground-11.vercel.app/assets/logo.jpg",
    "url": "https://ground-11.vercel.app",
    "telephone": "+919916849328",
    "priceRange": "$$",
    "servesCuisine": [
      "Specialty Coffee",
      "Artisanal Pastries",
      "Gourmet Desserts",
      "Handcrafted Cold Brews",
    ],
    "hasMenu": "https://ground-11.vercel.app/#menu",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ground Floor, Mindspace Building, Airport Road, Yeyyadi",
      "addressLocality": "Mangaluru",
      "addressRegion": "Karnataka",
      "postalCode": "575008",
      "addressCountry": "IN",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 12.923483,
      "longitude": 74.862412,
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "10:00",
        "closes": "20:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Sunday"],
        "opens": "10:30",
        "closes": "20:30",
      },
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "120",
    },
    "sameAs": [
      "https://www.instagram.com/underground11_coffeebar",
    ],
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, Credit Card, UPI",
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#070708" />
        <meta name="color-scheme" content="dark" />
        <link rel="canonical" href="https://ground-11.vercel.app" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;0,900;1,500;1,700&family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=Cinzel:wght@400;600;700&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Syne:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
