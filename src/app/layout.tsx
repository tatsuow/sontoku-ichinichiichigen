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
        <main className="flex-1">{children}</main>
        <footer className="bg-white border-t border-[rgba(107,83,68,0.15)] mt-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-[#8a7d6b] text-sm">
            <p>出典：二宮尊徳一日一言　致知出版社</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
