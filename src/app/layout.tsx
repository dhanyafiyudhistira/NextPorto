import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Neural Network Digit Recognition',
  description: 'Visualize a neural network recognizing handwritten digits in real-time',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
