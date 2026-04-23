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
3. Isi `AUTH_SECRET` dengan string acak panjang (minimal 32 karakter). Contoh generate:
   ```bash
   openssl rand -base64 48
   ```
4. Install dependency dan jalankan:
   ```bash
   npm install
   npm run dev
   ```

## Solusi error `Missing environment variable: AUTH_SECRET`
Jika muncul error berikut saat login:

```txt
Missing environment variable: AUTH_SECRET
```

Lakukan langkah ini:
1. Pastikan variabel `AUTH_SECRET` ada di `.env.local`.
2. Gunakan secret yang kuat dan unik per environment (local/staging/production).
3. Untuk Vercel, buka **Project Settings → Environment Variables** lalu tambahkan `AUTH_SECRET` pada environment yang dipakai.
4. Restart server dev setelah mengubah env (`Ctrl+C`, lalu `npm run dev`).

## Struktur penting
- `lib/mongodb-auth.js`: koneksi cluster auth.
- `lib/mongodb-product.js`: koneksi cluster produk.
- `app/api/auth/*`: endpoint login dan signup.
- `app/api/products`: endpoint list/tambah produk.
- `app/page.js`: katalog server-rendered dengan filter kategori.
