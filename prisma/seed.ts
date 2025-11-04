import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (be careful in production!)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.purchaseItem.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create Users
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const userPassword = await bcrypt.hash('User123!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@erp.test',
      name: 'Admin User',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@erp.test',
      name: 'Regular User',
      password: userPassword,
      role: Role.USER,
    },
  });

  console.log('✅ Created users:', { admin: admin.email, user: user.email });

  // Create Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'PT. Maju Jaya',
      email: 'maju.jaya@example.com',
      phone: '021-1234567',
      address: 'Jl. Sudirman No. 123, Jakarta',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'CV. Berkah Selalu',
      email: 'berkah@example.com',
      phone: '021-7654321',
      address: 'Jl. Gatot Subroto No. 456, Jakarta',
    },
  });

  console.log('✅ Created customers:', customer1.name, customer2.name);

  // Create Suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'PT. Supplier Utama',
      email: 'supplier.utama@example.com',
      phone: '021-1111111',
      address: 'Jl. Thamrin No. 789, Jakarta',
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'CV. Distributor Prima',
      email: 'distributor.prima@example.com',
      phone: '021-2222222',
      address: 'Jl. HR Rasuna Said No. 321, Jakarta',
    },
  });

  console.log('✅ Created suppliers:', supplier1.name, supplier2.name);

  // Create Products
  const product1 = await prisma.product.create({
    data: {
      sku: 'PRD-001',
      name: 'Laptop Dell Latitude 5420',
      unit: 'PCS',
      price: 12500000,
      reorderPoint: 5,
      quantityOnHand: 20,
      isActive: true,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      sku: 'PRD-002',
      name: 'Monitor LG 24 Inch',
      unit: 'PCS',
      price: 2500000,
      reorderPoint: 10,
      quantityOnHand: 35,
      isActive: true,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      sku: 'PRD-003',
      name: 'Keyboard Mechanical Logitech',
      unit: 'PCS',
      price: 850000,
      reorderPoint: 15,
      quantityOnHand: 50,
      isActive: true,
    },
  });

  const product4 = await prisma.product.create({
    data: {
      sku: 'PRD-004',
      name: 'Mouse Wireless Logitech MX Master 3',
      unit: 'PCS',
      price: 1200000,
      reorderPoint: 20,
      quantityOnHand: 45,
      isActive: true,
    },
  });

  const product5 = await prisma.product.create({
    data: {
      sku: 'PRD-005',
      name: 'Printer HP LaserJet Pro',
      unit: 'PCS',
      price: 3500000,
      reorderPoint: 3,
      quantityOnHand: 8,
      isActive: true,
    },
  });

  console.log('✅ Created products:', [product1, product2, product3, product4, product5].map(p => p.name).join(', '));

  // Create a sample Purchase with items
  const purchase1 = await prisma.purchase.create({
    data: {
      supplierId: supplier1.id,
      notes: 'Initial stock purchase',
      items: {
        create: [
          {
            productId: product1.id,
            qty: 10,
            unitCost: 11000000,
            subtotal: 110000000,
          },
          {
            productId: product2.id,
            qty: 20,
            unitCost: 2200000,
            subtotal: 44000000,
          },
        ],
      },
      total: 154000000,
    },
    include: {
      items: true,
    },
  });

  console.log('✅ Created sample purchase with', purchase1.items.length, 'items');

  // Create a sample Order (DRAFT)
  const order1 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      userId: admin.id,
      status: 'DRAFT',
      notes: 'Sample draft order',
      items: {
        create: [
          {
            productId: product3.id,
            qty: 5,
            unitPrice: 850000,
            subtotal: 4250000,
          },
          {
            productId: product4.id,
            qty: 3,
            unitPrice: 1200000,
            subtotal: 3600000,
          },
        ],
      },
      total: 7850000,
    },
    include: {
      items: true,
    },
  });

  console.log('✅ Created sample order (DRAFT) with', order1.items.length, 'items');

  console.log('🎉 Seed completed successfully!');
  console.log('\n📝 Login credentials:');
  console.log('Admin: admin@erp.test / Admin123!');
  console.log('User:  user@erp.test / User123!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
