'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav style={{ backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(61,52,40,0.08)' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
          {/* サイトタイトル */}
          <Link href="/" className="text-base font-semibold text-[#3d3428] hover:text-[#6b5344] transition-colors tracking-wide">
            二宮尊徳一日一言
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
              管理
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
