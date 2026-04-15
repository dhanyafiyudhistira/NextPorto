# Product Requirements Document (PRD)

## Nama Proyek
**Lightweight Web App Catalog (Multi-Cluster MongoDB)**

## Teknologi
- **Frontend**: Next.js (App Router)
- **Styling**: Vanilla CSS / CSS Modules
- **Database**: MongoDB Native Driver (2 cluster Atlas)
- **Deployment**: Vercel

---

## 1. Tujuan Proyek
Membangun aplikasi katalog web yang fokus pada kecepatan rendering (lightweight) dengan memisahkan database user (autentikasi) dan database produk pada dua cluster MongoDB Atlas yang berbeda.

## 2. Spesifikasi Teknis (The Stack)
- **Frontend**: Next.js 14+ (App Router), memaksimalkan Server Components untuk menekan beban JavaScript client.
- **Styling**: CSS Modules / Vanilla CSS. Tidak memakai Tailwind atau framework eksternal agar bundle kecil.
- **Database**:
  - **Cluster A (Auth)**: Menyimpan data user (User/Admin).
  - **Cluster B (Product)**: Menyimpan data katalog produk.
- **Driver**: MongoDB Native Driver (`mongodb`) untuk overhead lebih ringan.
- **Deployment**: Vercel.

## 3. Fitur Utama
| Fitur | Deskripsi | Aktor |
|---|---|---|
| Auth System | Login dan Sign Up terhubung ke Cluster Auth | Semua |
| Add Product | Form input produk baru tersimpan di Cluster Product | Admin |
| Filter Produk | Filtering berdasarkan kategori/jenis produk secara instan | Semua |
| Fast Rendering | `next/image` + CSS murni untuk performa maksimal | Semua |

## 4. Arsitektur Data (Dual Cluster)
Aplikasi mendefinisikan dua koneksi database paralel:
1. `lib/mongodb-auth.js`: koneksi khusus user/auth.
2. `lib/mongodb-product.js`: koneksi khusus produk.

## 5. Struktur Antarmuka (Simple UI)
- **Font**: System font stack (`sans-serif`) tanpa unduhan font eksternal.
- **Katalog**: CSS Grid sederhana (1 kolom mobile, 4 kolom desktop).
- **Ringan**: Tanpa library animasi/komponen pihak ketiga yang berat.

---

## Boilerplate Koneksi Dua Cluster MongoDB
```js
import { MongoClient } from 'mongodb';

const uriAuth = process.env.MONGODB_AUTH_URI;
const uriProduct = process.env.MONGODB_PRODUCT_URI;

export const authClient = new MongoClient(uriAuth).connect();
export const productClient = new MongoClient(uriProduct).connect();
```
