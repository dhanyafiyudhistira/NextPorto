import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "SCADA DER System | Active Power Curtailment",
  description: "Web-based SCADA system for Distributed Energy Resources with AI-powered Active Power Curtailment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-6 grid-bg">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
