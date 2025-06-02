import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Metadata should ideally stay in the src/app layout or page file.
// If RootLayoutContent also exports metadata, ensure it's handled correctly.
export const metadata: Metadata = {
  title: 'Hack the Past - Enigma Machine',
  description: 'Explore the history of the Enigma Machine and Alan Turing\'s work during WWII',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-gray-100 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
