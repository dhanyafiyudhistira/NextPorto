import './globals.css';

export const metadata = {
  title: 'Lightweight Web Catalog',
  description: 'Next.js lightweight catalog with dual-cluster MongoDB architecture.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
