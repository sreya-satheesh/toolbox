import type { Metadata } from 'next';
import './globals.css';
import 'react-image-crop/dist/ReactCrop.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Open_Sans } from 'next/font/google';

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
});

export const metadata: Metadata = {
  title: 'Toolbox - Free Online Developer Tools',
  description: 'A comprehensive collection of free online developer tools, including formatters, converters, encoders, decoders, and utilities for code, images, and data. Simplify your workflow with our all-in-one toolbox.',
  keywords: ['developer tools', 'online tools', 'formatter', 'converter', 'encoder', 'decoder', 'minifier', 'beautifier', 'JSON', 'YAML', 'CSV', 'Base64', 'JWT', 'hash generator', 'image tools', 'color tools'],
  openGraph: {
    title: 'Toolbox - Free Online Developer Tools',
    description: 'The ultimate collection of utilities for developers. Format, convert, and process data with ease.',
    type: 'website',
    url: 'https://toolbox-psi-nine.vercel.app/',
    images: [
      {
        url: '',
        width: 1200,
        height: 630,
        alt: 'Toolbox - Online Developer Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toolbox - Free Online Developer Tools',
    description: 'The ultimate collection of utilities for developers. Format, convert, and process data with ease.'
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={openSans.variable}>
      <body className="font-body antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
