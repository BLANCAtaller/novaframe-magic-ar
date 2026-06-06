'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Utensils, BarChart2 } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Hoy', Icon: Utensils },
  { href: '/historial', label: 'Historial', Icon: BarChart2 },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: '#fff', borderTop: '1px solid #e5e7eb', display: 'flex', paddingBottom: 'env(safe-area-inset-bottom)', zIndex: 50 }}>
      {navItems.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, paddingTop: 10, paddingBottom: 10, color: active ? '#10b981' : '#9ca3af', textDecoration: 'none', fontSize: 11, fontWeight: active ? 600 : 400, minHeight: 56 }}>
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
