import Link from 'next/link';

export function Navigation() {
  return (
    <nav style={{ backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(61,52,40,0.08)' }}>
      <div style={{ maxWidth: '992px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '4rem' }}>
          <Link href="/" className="text-base font-semibold text-[#3d3428] hover:text-[#6b5344] transition-colors tracking-wide">
            二宮尊徳一日一言
          </Link>
        </div>
      </div>
    </nav>
  );
}
