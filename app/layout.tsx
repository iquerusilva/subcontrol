import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Azentos | Creative Branding Studio',
  description: 'Unlock your business potential with our expert solutions.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-black text-white antialiased overflow-x-hidden`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
