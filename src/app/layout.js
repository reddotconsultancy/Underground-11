import "./globals.css";

export const metadata = {
  title: "Underground 11 Coffee Bar — Specialty Coffee, Desserts & Late-Night Vibes",
  description: "Underground 11 Coffee Bar — specialty coffee, signature desserts, and premium late-night cafe energy. Explore our iconic menu and moody atmosphere.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,700;0,900;1,500;1,700&family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
