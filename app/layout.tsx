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
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
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
