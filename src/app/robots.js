export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/admin', '/ar-viewer', '/deployment-hub'],
      },
    ],
    sitemap: 'https://novaframe.pages.dev/sitemap.xml',
  };
}
