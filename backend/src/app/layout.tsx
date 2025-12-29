
import "./globals.css";
import { UpdateProvider } from './components/hooks/useEventUpdates';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '🖥️⚙️ Sistema Interno - Mantenimiento de Equipos 🔧💻',
  description: 'Sistema de Mantenimiento de Equipos de Cómputo - Secretaría de Bienestar del Estado de Sonora',
  keywords: 'sistema, mantenimiento, equipos, computo, secretaria, bienestar, sonora, interno',
  authors: [{ name: 'Secretaría de Bienestar del Estado de Sonora' }],
  creator: 'Secretaría de Bienestar del Estado de Sonora',
  publisher: 'Gobierno del Estado de Sonora',
  robots: 'noindex, nofollow', // Sistema interno, no indexar
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: '🖥️⚙️ Sistema Interno - Mantenimiento de Equipos 🔧💻',
    description: 'Sistema de Mantenimiento de Equipos de Cómputo - Secretaría de Bienestar del Estado de Sonora',
    type: 'website',
    locale: 'es_MX',
  },
  twitter: {
    card: 'summary',
    title: '🖥️⚙️ Sistema Interno - Mantenimiento de Equipos 🔧💻',
    description: 'Sistema de Mantenimiento de Equipos de Cómputo',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <title>🖥️⚙️ Sistema Interno - Mantenimiento de Equipos 🔧💻</title>
        <meta name="description" content="Sistema de Mantenimiento de Equipos de Cómputo - Secretaría de Bienestar del Estado de Sonora" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <UpdateProvider>
          {children}
        </UpdateProvider>
      </body>
    </html>
  );
}
