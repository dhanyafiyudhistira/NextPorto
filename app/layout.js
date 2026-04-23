import './globals.css';

export const metadata = {
  title: 'NextPorto Catalog',
  description: 'Lightweight web catalog with dual MongoDB clusters'
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
