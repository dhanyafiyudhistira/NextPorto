'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navigation.module.css';

const Navigation: React.FC = () => {
  const pathname = usePathname();

  const links = [
    {
      href: '/',
      label: 'Gauge View',
      icon: '◉',
      description: 'Real-time gauge telemetry',
    },
    {
      href: '/charts',
      label: 'Bar Charts',
      icon: '▮',
      description: 'Bar chart visualization',
    },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            NILM Dashboard
          </Link>
          <span className={styles.subtitle}>Federated Learning System</span>
        </div>

        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.link} ${
                  pathname === link.href ? styles.linkActive : ''
                }`}
                title={link.description}
              >
                <span className={styles.icon}>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
