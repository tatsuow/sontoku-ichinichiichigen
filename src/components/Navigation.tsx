'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-[0_1px_3px_rgba(61,52,40,0.08)]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* サイトタイトル */}
          <Link href="/" className="text-base font-semibold text-[#3d3428] hover:text-[#6b5344] transition-colors tracking-wide">
            二宮尊徳一日一言
          </Link>

          {/* 中央の肖像アバター */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[rgba(107,83,68,0.2)] shadow-[0_2px_8px_rgba(61,52,40,0.12)]">
              <Image
                src="/sontoku-portrait.svg"
                alt="二宮尊徳"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          {/* ナビゲーションボタン */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === '/'
                  ? 'bg-[#6b5344] text-white shadow-[0_1px_4px_rgba(107,83,68,0.3)]'
                  : 'text-[#6b5344] hover:bg-[#f5f1ec]'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              ホーム
            </Link>
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === '/admin'
                  ? 'bg-[#6b5344] text-white shadow-[0_1px_4px_rgba(107,83,68,0.3)]'
                  : 'text-[#6b5344] hover:bg-[#f5f1ec]'
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
