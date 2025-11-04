# ERP System - NextJS + SWC + Prisma + PostgreSQL

ERP web-based lengkap dengan Next.js 14 (App Router, TypeScript), Prisma ORM, PostgreSQL database, menggunakan **Speedy Web Compiler (SWC)** untuk performa optimal.

## 🚀 Features

### Core Technologies
- ✅ **Next.js 14+** dengan App Router dan TypeScript
- ✅ **SWC (Speedy Web Compiler)** - aktif untuk minify & transform (NO Babel)
- ✅ **Prisma ORM** dengan PostgreSQL
- ✅ **NextAuth.js** - Authentication dengan Credentials provider
- ✅ **Zod + React Hook Form** - Form validation
- ✅ **Tailwind CSS** - Styling minimal tanpa library UI pihak ketiga

### Business Features
- 🔐 **Authentication & Authorization**
  - Login/Register dengan JWT HttpOnly session
  - Role-Based Access Control (RBAC): ADMIN & USER
  - Middleware untuk route protection

- 📦 **Product Management** (ADMIN only)
  - CRUD products
  - Stock tracking (quantity on hand)
  - Reorder point monitoring
  - Active/Inactive status

- 👥 **Customer Management** (ADMIN only)
  - CRUD customers
  - Contact information management

- 🏭 **Supplier Management** (ADMIN only)
  - CRUD suppliers
  - Supplier contact details

- 🛒 **Order Management**
  - Create orders (DRAFT) - available for all users
  - Confirm orders (ADMIN only) - reduces stock automatically
  - Cancel orders (ADMIN only)
  - Multi-item orders with automatic total calculation
  - Stock validation before confirmation

- 🛍️ **Purchase Management** (ADMIN only)
  - Create purchase orders
  - Automatic stock increment upon purchase creation
  - Transaction-based stock updates

### UI/UX Features
- 🎨 Clean UI dengan semantic HTML + Tailwind CSS
- ➕ **"Add (+)" button** di setiap halaman list untuk quick access
- 📱 Responsive design
- 🎯 Simple & intuitive navigation
- 🔍 Search & filter functionality
- 📊 Dashboard dengan statistics & low stock alerts

## 📋 Prerequisites

- **Node.js** 18.x atau lebih tinggi
- **PostgreSQL** 14.x atau lebih tinggi
- **pnpm** (recommended) atau npm/yarn

## 🛠️ Setup Instructions

### 1. Clone Repository

```bash
git clone <repository-url>
cd NextPorto
```

### 2. Install Dependencies

```bash
pnpm install
# atau
npm install
```

### 3. Setup Database

Pastikan PostgreSQL sudah running, kemudian buat database:

```sql
CREATE DATABASE erp_next;
```

### 4. Configure Environment Variables

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi Anda:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/erp_next?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # Generate: openssl rand -base64 32

# App
NODE_ENV="development"
```

### 5. Setup Prisma & Database Migration

```bash
# Generate Prisma Client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev --name init

# Seed initial data
pnpm prisma db seed
```

**Atau gunakan shortcut:**

```bash
pnpm run db:setup
```

### 6. Run Development Server

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 🔑 Default Login Credentials

Setelah seeding, gunakan credentials berikut untuk login:

### Admin Account
- **Email:** admin@erp.test
- **Password:** Admin123!
- **Role:** ADMIN (full access)

### User Account
- **Email:** user@erp.test
- **Password:** User123!
- **Role:** USER (limited access)

## 📁 Project Structure

```
NextPorto/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeding
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── products/     # Products CRUD
│   │   │   ├── customers/    # Customers CRUD
│   │   │   ├── suppliers/    # Suppliers CRUD
│   │   │   ├── orders/       # Orders + confirm/cancel
│   │   │   └── purchases/    # Purchases (stock increment)
│   │   ├── auth/             # Login & Register pages
│   │   ├── dashboard/        # Dashboard
│   │   ├── products/         # Products pages
│   │   ├── customers/        # Customers pages
│   │   ├── suppliers/        # Suppliers pages
│   │   ├── orders/           # Orders pages
│   │   ├── purchases/        # Purchases pages
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Root page (redirect)
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Dialog.tsx
│   │   │   └── TextArea.tsx
│   │   └── layout/           # Layout components
│   │       ├── DashboardLayout.tsx
│   │       ├── Sidebar.tsx
│   │       └── Topbar.tsx
│   ├── lib/                  # Utility libraries
│   │   ├── db.ts            # Prisma client singleton
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── rbac.ts          # Role-based access control
│   │   ├── validators.ts    # Zod schemas
│   │   └── currency.ts      # Currency formatting
│   ├── types/
│   │   └── next-auth.d.ts   # NextAuth type definitions
│   └── middleware.ts         # Route protection middleware
├── next.config.js            # Next.js config (SWC enabled!)
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind config
├── package.json
└── README.md
```

## 🎯 Key Features Explained

### SWC Configuration

SWC sudah aktif di `next.config.js`:

```javascript
module.exports = {
  swcMinify: true,  // ✅ SWC minification enabled
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
};
```

**NO Babel config** - semua compilation menggunakan SWC default Next.js.

### RBAC (Role-Based Access Control)

- **ADMIN** dapat:
  - CRUD Products, Customers, Suppliers
  - Create, view, confirm, cancel Orders
  - Create & view Purchases
  - Manage all master data

- **USER** dapat:
  - View & create Orders (DRAFT only)
  - View dashboard
  - **Cannot** manage master data atau confirm orders

### Stock Management

#### Orders (Reduce Stock)
1. User/Admin membuat order (status: DRAFT)
2. ADMIN confirm order → stock berkurang otomatis
3. Menggunakan Prisma transaction untuk data consistency

#### Purchases (Increase Stock)
1. ADMIN membuat purchase
2. Stock otomatis bertambah saat purchase dibuat
3. Menggunakan Prisma transaction

## 🧪 Testing

### Test Build dengan SWC

```bash
pnpm build
```

Verifikasi bahwa build sukses tanpa error dan menggunakan SWC (bukan Babel).

### Run Production Build

```bash
pnpm build
pnpm start
```

## 📦 Available Scripts

```json
{
  "dev": "next dev",                    // Development server
  "build": "next build",                // Production build
  "start": "next start",                // Production server
  "lint": "next lint",                  // ESLint
  "prisma:generate": "prisma generate", // Generate Prisma Client
  "prisma:migrate": "prisma migrate dev", // Run migrations
  "prisma:seed": "tsx prisma/seed.ts",  // Seed database
  "prisma:studio": "prisma studio",     // Open Prisma Studio
  "db:setup": "prisma generate && prisma migrate dev --name init && prisma db seed"
}
```

## 🔒 Security Features

- ✅ Password hashing dengan bcryptjs
- ✅ JWT-based session dengan NextAuth
- ✅ HttpOnly cookies untuk token storage
- ✅ Middleware protection untuk private routes
- ✅ RBAC pada API routes
- ✅ Input validation dengan Zod
- ✅ CSRF protection (Next.js default)

## 🎨 UI Components

Semua UI components dibuat dari scratch tanpa library:
- Clean & minimalist design
- Full TypeScript support
- Accessible & semantic HTML
- Responsive Tailwind styling

## 📊 Database Schema

### Models
- **User** - Authentication & user management
- **Product** - Product catalog dengan stock tracking
- **Customer** - Customer management
- **Supplier** - Supplier management
- **Order** - Sales orders dengan status workflow
- **OrderItem** - Order line items
- **Purchase** - Purchase orders
- **PurchaseItem** - Purchase line items

### Relationships
- User → Orders (one-to-many)
- Customer → Orders (one-to-many)
- Supplier → Purchases (one-to-many)
- Product → OrderItems & PurchaseItems (one-to-many)
- Order → OrderItems (one-to-many, cascade delete)
- Purchase → PurchaseItems (one-to-many, cascade delete)

## 🚀 Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Import project di Vercel
3. Set environment variables
4. Deploy!

### Environment Variables untuk Production

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
NODE_ENV="production"
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Products (ADMIN only)
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get product detail
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Customers (ADMIN only)
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/[id]` - Get customer detail
- `PUT /api/customers/[id]` - Update customer
- `DELETE /api/customers/[id]` - Delete customer

### Suppliers (ADMIN only)
- `GET /api/suppliers` - List all suppliers
- `POST /api/suppliers` - Create supplier
- `GET /api/suppliers/[id]` - Get supplier detail
- `PUT /api/suppliers/[id]` - Update supplier
- `DELETE /api/suppliers/[id]` - Delete supplier

### Orders
- `GET /api/orders` - List all orders
- `POST /api/orders` - Create order (DRAFT)
- `GET /api/orders/[id]` - Get order detail
- `POST /api/orders/[id]/confirm` - Confirm order (ADMIN, reduce stock)
- `POST /api/orders/[id]/cancel` - Cancel order (ADMIN)
- `DELETE /api/orders/[id]` - Delete DRAFT order

### Purchases (ADMIN only)
- `GET /api/purchases` - List all purchases
- `POST /api/purchases` - Create purchase (auto increment stock)
- `GET /api/purchases/[id]` - Get purchase detail

## 🐛 Troubleshooting

### Build Errors

Jika terjadi error saat build:

```bash
# Clear cache dan rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

### Database Connection Issues

Pastikan:
1. PostgreSQL service running
2. DATABASE_URL benar di `.env`
3. Database sudah dibuat

### NextAuth Errors

Pastikan:
1. NEXTAUTH_SECRET sudah di-set
2. NEXTAUTH_URL sesuai dengan URL aplikasi

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [SWC Documentation](https://swc.rs/docs/getting-started)

## ✅ Acceptance Criteria

- [x] Build & dev menggunakan SWC (swcMinify: true), tanpa Babel
- [x] Login/Register berfungsi; middleware redirect bila belum login
- [x] RBAC: USER tidak bisa CRUD master & confirm order
- [x] Setiap halaman list memiliki tombol "Add (+)" ke /new
- [x] Form create bekerja untuk semua modules
- [x] Orders confirm mengurangi stok; Purchases menambah stok (transaction)
- [x] UI clean, responsif, tanpa Shadcn (Tailwind/CSS modular saja)
- [x] README jelas + seed sukses

## 👨‍💻 Author

Built with ❤️ using Next.js, SWC, Prisma, and PostgreSQL

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

**Happy Coding! 🚀**