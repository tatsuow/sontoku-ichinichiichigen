'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  const tabs = [
    { label: 'ホーム', href: '/' },
    { label: '管理', href: '/admin' },
  ];

  return (
    <nav className="bg-white border-b border-[rgba(107,83,68,0.15)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-[#6b5344] bg-[#6b5344] text-white'
                    : 'border-transparent text-[rgba(61,52,40,0.7)] hover:text-[#3d3428]'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
