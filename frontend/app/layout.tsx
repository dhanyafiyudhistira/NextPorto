import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";
import styles from "../styles/Layout.module.css";
import { Providers } from "../components/Providers";
import { WalletButton } from "../components/WalletButton";
import { NetworkAlert } from "../components/NetworkAlert";

export const metadata: Metadata = {
  title: "Simple E-Voting",
  description: "Minimal on-chain e-voting powered by Hardhat and Next.js"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className={styles.app}>
            <header className={styles.header}>
              <div className={styles.brand}>
                <Link href="/">Simple E-Voting</Link>
              </div>
              <nav className={styles.navLinks}>
                <Link href="/">Home</Link>
                <Link href="/admin">Admin</Link>
              </nav>
              <WalletButton />
            </header>
            <NetworkAlert />
            <main className={styles.main}>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
