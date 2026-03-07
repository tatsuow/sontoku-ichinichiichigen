import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import './globals.css';

export const metadata: Metadata = {
  title: '二宮尊徳一日一言',
  description: '二宮尊徳の日々の教えと示唆',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-[#faf8f5] text-[#3d3428]">
        <Navigation />
        <main className="flex-1 min-h-screen">{children}</main>
        <footer className="py-6 text-center text-xs text-[rgba(107,83,68,0.4)]">
          © 二宮尊徳一日一言
        </footer>
      </body>
    </html>
  );
}
