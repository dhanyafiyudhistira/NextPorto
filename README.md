# NextPorto

A modern business management application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Customer Management**: Add, view, and manage your customer database
- **Supplier Management**: Track and manage your supplier relationships
- **Order Management**: Create and track orders with customizable status
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Local Storage**: Data persists in browser localStorage

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
NextPorto/
├── app/                    # Next.js app directory
│   ├── customers/         # Customer management page
│   ├── suppliers/         # Supplier management page
│   ├── orders/            # Order management page
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Home/dashboard page
│   └── globals.css        # Global styles
├── lib/                   # Utility functions
│   └── storage.ts         # localStorage helper functions
├── types/                 # TypeScript type definitions
│   └── index.ts           # Type definitions for Customer, Supplier, Order
└── public/                # Static assets
```

## Technologies Used

- **Next.js 15**: React framework for production
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React 18**: UI library

## License

MIT