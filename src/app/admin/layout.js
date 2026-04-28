export const metadata = {
  title: "Hub Central — NovaFrame Admin",
  description: "Panel de administración de NovaFrame.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

import ClientAdminGuard from '@/components/ClientAdminGuard';

export default function AdminLayout({ children }) {
  return (
    <ClientAdminGuard>
      {children}
    </ClientAdminGuard>
  );
}
