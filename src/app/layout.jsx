import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MyHouse Manager',
  description: 'Qu?n lý xây d?ng nhà ?',
};

export default function RootLayout({ children }) {
  return (
    <html lang='vi'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
