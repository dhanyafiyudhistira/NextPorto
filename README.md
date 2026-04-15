# NextPorto

Lightweight web app catalog berbasis Next.js App Router dengan arsitektur dual-cluster MongoDB.

## Stack
- Next.js 14 (App Router)
- Vanilla CSS
- MongoDB Native Driver

## Menjalankan lokal
1. Salin env:
   ```bash
   cp .env.example .env.local
   ```
2. Isi dua URI cluster MongoDB.
3. Install dependency dan jalankan:
   ```bash
   npm install
   npm run dev
   ```

## Struktur penting
- `lib/mongodb-auth.js`: koneksi cluster auth.
- `lib/mongodb-product.js`: koneksi cluster produk.
- `app/api/auth/*`: endpoint login dan signup.
- `app/api/products`: endpoint list/tambah produk.
- `app/page.js`: katalog server-rendered dengan filter kategori.
