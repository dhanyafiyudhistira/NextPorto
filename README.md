# NextPorto

Lightweight katalog produk berbasis **Next.js App Router** dengan arsitektur **dual-cluster MongoDB Atlas**:

- Cluster Auth untuk user/login.
- Cluster Product untuk katalog.

## Menjalankan Lokal

1. Salin env file:
   ```bash
   cp .env.example .env.local
   ```
2. Isi connection string MongoDB Atlas.
3. Install dependency dan jalankan:
   ```bash
   npm install
   npm run dev
   ```

## Struktur Utama

- `lib/mongodb-auth.js`: koneksi MongoDB untuk autentikasi.
- `lib/mongodb-product.js`: koneksi MongoDB untuk produk.
- `app/api/auth/*`: endpoint signup/login.
- `app/api/products/route.js`: endpoint list & create produk.
- `components/ProductFilter.js`: filter kategori instan di client.
- `components/ProductGrid.js`: render katalog dengan `next/image`.

## Catatan

Dokumen PRD tersedia di `PRD.md`.


## Development Tanpa MongoDB

Tanpa `MONGODB_PRODUCT_URI`, halaman katalog tetap bisa dirender dan akan menampilkan daftar produk kosong + notifikasi konfigurasi environment agar aplikasi tidak crash saat bootstrap awal.
