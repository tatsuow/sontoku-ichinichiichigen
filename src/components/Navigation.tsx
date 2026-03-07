'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#faf8f5] border-b border-[rgba(107,83,68,0.12)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* サイトタイトル */}
          <Link href="/" className="text-sm font-medium text-[#3d3428] hover:text-[#6b5344] transition-colors">
            二宮尊徳一日一言
          </Link>

          {/* 中央の肖像アバター */}
          <Link href="/" className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[rgba(107,83,68,0.2)] bg-[#f5f1ec] flex items-center justify-center">
              {/* 肖像画の代替SVGアイコン */}
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                <circle cx="20" cy="16" r="7" fill="#8a7d6b" opacity="0.6"/>
                <path d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14" fill="#8a7d6b" opacity="0.4"/>
              </svg>
            </div>
          </Link>

          {/* ナビゲーションボタン */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-[8px] text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-[#6b5344] text-white'
                  : 'border border-[rgba(107,83,68,0.3)] text-[#6b5344] hover:bg-[#f5f1ec]'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              ホーム
            </Link>
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-[8px] text-sm font-medium transition-colors ${
                pathname === '/admin'
                  ? 'bg-[#6b5344] text-white'
                  : 'border border-[rgba(107,83,68,0.3)] text-[#6b5344] hover:bg-[#f5f1ec]'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              管理
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
