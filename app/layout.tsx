import type { Metadata } from 'next';
import './globals.css';
import { PollutionProvider } from '@/components/PollutionContext';
import GoogleTranslate from '@/components/GoogleTranslate';

export const metadata: Metadata = {
  title: 'Emission-Sense — Vehicle Emission Calculator',
  description: 'Scientifically accurate multi-pollutant vehicle emission calculator based on IPCC, COPERT & EMEP/EEA methods. Check CO₂, NOx, PM2.5, CO & HC for any Indian vehicle.',
  keywords: 'vehicle emission calculator, CO2, NOx, PM2.5, pollution, IPCC, COPERT, India, BS6, emission factors',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossOrigin="" async></script>
      </head>
      <body>
        <PollutionProvider>
          {children}
        </PollutionProvider>
        <GoogleTranslate />
      </body>
    </html>
  );
}
