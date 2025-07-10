import './globals.css';
import type { Metadata } from 'next';
import { Inter, Roboto, Open_Sans, Lato, Montserrat, Poppins } from 'next/font/google';
import { MenuProvider } from '@/contexts/MenuContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({ weight: ['300', '400', '500', '700'], subsets: ['latin'], variable: '--font-roboto' });
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans' });
const lato = Lato({ weight: ['300', '400', '700'], subsets: ['latin'], variable: '--font-lato' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const poppins = Poppins({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'], variable: '--font-poppins' });

export const metadata: Metadata = {
  title: 'Digital Menu Platform',
  description: 'Create and manage digital restaurant menus',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${roboto.variable} ${openSans.variable} ${lato.variable} ${montserrat.variable} ${poppins.variable} font-inter`}>
        <LanguageProvider>
          <MenuProvider>
            {children}
          </MenuProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}