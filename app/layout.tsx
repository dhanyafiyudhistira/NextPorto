import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextPorto ERP",
  description: "Enterprise Resource Planning System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex gap-6">
            <a href="/" className="hover:text-gray-300">Home</a>
            <a href="/admin/customers" className="hover:text-gray-300">Customers</a>
            <a href="/admin/products" className="hover:text-gray-300">Products</a>
            <a href="/orders/create" className="hover:text-gray-300">Create Order</a>
          </div>
        </nav>
        <main className="container mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
