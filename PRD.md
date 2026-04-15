# Product Requirements Document (PRD)

## Nama Proyek
**Lightweight Web App Catalog (Multi-Cluster MongoDB)**

## Teknologi
- **Frontend:** Next.js (App Router)
- **Styling:** Vanilla CSS (CSS Modules/Global CSS)
- **Database Driver:** MongoDB Native Driver (`mongodb`)
- **Deployment:** Vercel

---

## 1. Tujuan Proyek
Membangun aplikasi katalog web yang fokus pada kecepatan rendering (lightweight) dengan memisahkan database user (autentikasi) dan database produk pada dua cluster MongoDB Atlas yang berbeda.

## 2. Spesifikasi Teknis (The Stack)
- **Next.js 14+ (App Router)**
  - Memaksimalkan Server Components untuk mengurangi JavaScript di sisi client.
- **Vanilla CSS / CSS Modules**
  - Tidak menggunakan Tailwind atau framework styling eksternal demi bundle yang kecil.
- **MongoDB Atlas (Dual Cluster)**
  - **Cluster A (Auth):** data user (User/Admin)
  - **Cluster B (Product):** data katalog produk
- **MongoDB Native Driver (`mongodb`)**
  - Lebih ringan dan overhead lebih kecil dibanding Mongoose.
- **Vercel Deployment**
  - Memanfaatkan optimasi bawaan Next.js.

## 3. Fitur Utama
| Fitur | Deskripsi | Aktor |
| --- | --- | --- |
| Auth System | Login dan Sign Up terhubung ke Cluster Auth | Semua |
| Add Product | Form input produk baru tersimpan di Cluster Product | Admin |
| Filter Produk | Filtering kategori/jenis produk secara instan | Semua |
| Fast Rendering | Menggunakan `next/image` dan CSS murni | Semua |

## 4. Arsitektur Data (Dual Cluster)
Aplikasi mendefinisikan dua koneksi database berjalan paralel:
1. `lib/mongodb-auth.js` mengelola koneksi cluster khusus user.
2. `lib/mongodb-product.js` mengelola koneksi cluster khusus produk.

## 5. Struktur Antarmuka (Simple UI)
- Menggunakan **System Font Stack** (`sans-serif`) agar tidak mengunduh font eksternal.
- Katalog menggunakan **CSS Grid sederhana**:
  - 1 kolom di mobile
  - 4 kolom di desktop
- Menghindari library animasi/komponen pihak ketiga yang berat.

## 6. Environment Variables
Set dua connection string di Vercel:

- `MONGODB_AUTH_URI`
- `MONGODB_AUTH_DB`
- `MONGODB_PRODUCT_URI`
- `MONGODB_PRODUCT_DB`

Contoh koneksi dasar dengan native driver:

```js
import { MongoClient } from 'mongodb';

const uriAuth = process.env.MONGODB_AUTH_URI;
const uriProduct = process.env.MONGODB_PRODUCT_URI;

export const authClient = new MongoClient(uriAuth).connect();
export const productClient = new MongoClient(uriProduct).connect();
```
