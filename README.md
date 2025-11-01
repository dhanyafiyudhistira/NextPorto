# ERP System - Next.js + Prisma + Shadcn UI

Simple ERP system built with Next.js (App Router), TypeScript, Prisma, PostgreSQL, and Shadcn UI.

## Features

- **Authentication**: Login/Register with NextAuth.js (Credentials provider)
- **RBAC**: Role-based access control (ADMIN/USER)
- **Master Data Management**:
  - Products (ADMIN only)
  - Customers (ADMIN only)
  - Suppliers (ADMIN only)
- **Transactions**:
  - Orders (All users, confirm requires ADMIN)
  - Purchases (All users, with automatic stock updates)
- **Purchases Module** (Special Features):
  - Dynamic item rows (add/remove)
  - Quantity +/- buttons (minimum 1)
  - Auto-calculate subtotal & grand total
  - Automatic stock update on purchase creation
  - Keyboard shortcuts: `Ctrl+Enter` to submit, `Alt+=` to add item
- **Dashboard**: Statistics and low stock alerts
- **UI**: Full Shadcn UI components with professional theme

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js with Credentials provider
- **UI**: Shadcn UI + Tailwind CSS + Radix UI
- **Form**: React Hook Form + Zod validation
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (recommended) or npm

## Installation

### 1. Clone and Install Dependencies

```bash
# Install dependencies
pnpm install
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/erp_next?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

# App
NODE_ENV="development"
```

### 3. Setup Database

```bash
# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database with sample data
pnpm db:seed
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Login Credentials

After seeding, use these credentials:

**Admin:**
- Email: `admin@erp.test`
- Password: `Admin123!`

**User:**
- Email: `user@erp.test`
- Password: `User123!`

## Project Structure

```
NextPorto/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
├── src/
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── auth/           # Auth pages
│   │   ├── dashboard/      # Dashboard
│   │   ├── products/       # Products (ADMIN only)
│   │   ├── customers/      # Customers (ADMIN only)
│   │   ├── suppliers/      # Suppliers (ADMIN only)
│   │   ├── orders/         # Orders
│   │   └── purchases/      # Purchases with +/- buttons
│   ├── components/
│   │   ├── ui/             # Shadcn components
│   │   ├── layout/         # Layout components
│   │   └── purchase/       # Purchase components
│   ├── lib/
│   │   ├── auth.ts         # NextAuth config
│   │   ├── db.ts           # Prisma client
│   │   ├── rbac.ts         # Access control
│   │   └── validators.ts   # Zod schemas
│   └── middleware.ts       # Route protection
```

## Purchases Module - Special Features

### 1. Quantity +/- Buttons
- Click `+` to increment quantity
- Click `-` to decrement (minimum 1)
- Direct input also supported

### 2. Dynamic Item Rows
- Click "Add Item" to add new rows
- Click trash icon to remove rows
- Minimum 1 item required

### 3. Auto-Calculation
- Subtotal = Quantity × Unit Cost (real-time)
- Grand Total = Sum of all subtotals (real-time)

### 4. Stock Update
- On purchase creation, `quantityOnHand` automatically increments
- Uses Prisma transaction for data consistency

### 5. Keyboard Shortcuts
- `Ctrl/Cmd + Enter`: Submit form
- `Alt + =`: Add new item row

## Available Scripts

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm db:generate      # Generate Prisma Client
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio
```

## License

MIT