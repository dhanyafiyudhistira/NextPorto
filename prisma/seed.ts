import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clean existing data
  await prisma.purchaseItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.purchase.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const adminPassword = await hash('Admin123!', 10)
  const userPassword = await hash('User123!', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@erp.test',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const user = await prisma.user.create({
    data: {
      email: 'user@erp.test',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  })

  console.log('✅ Users created')

  // Create customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'PT Maju Jaya',
      email: 'info@majujaya.com',
      phone: '021-12345678',
      address: 'Jl. Sudirman No. 123',
      city: 'Jakarta',
      country: 'Indonesia',
      isActive: true,
    },
  })

  const customer2 = await prisma.customer.create({
    data: {
      name: 'CV Berkah Sejahtera',
      email: 'contact@berkahsejahtera.com',
      phone: '022-87654321',
      address: 'Jl. Asia Afrika No. 45',
      city: 'Bandung',
      country: 'Indonesia',
      isActive: true,
    },
  })

  console.log('✅ Customers created')

  // Create supplier
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'PT Supplier Utama',
      email: 'sales@supplierutama.com',
      phone: '021-99887766',
      address: 'Jl. Gatot Subroto No. 88',
      city: 'Jakarta',
      country: 'Indonesia',
      isActive: true,
    },
  })

  console.log('✅ Suppliers created')

  // Create products
  const product1 = await prisma.product.create({
    data: {
      sku: 'PRD-001',
      name: 'Laptop Dell XPS 13',
      description: 'Laptop premium untuk bisnis',
      unit: 'UNIT',
      price: 18000000,
      cost: 15000000,
      quantityOnHand: 10,
      reorderPoint: 5,
      isActive: true,
    },
  })

  const product2 = await prisma.product.create({
    data: {
      sku: 'PRD-002',
      name: 'Mouse Logitech MX Master 3',
      description: 'Mouse wireless ergonomis',
      unit: 'PCS',
      price: 1500000,
      cost: 1200000,
      quantityOnHand: 25,
      reorderPoint: 10,
      isActive: true,
    },
  })

  const product3 = await prisma.product.create({
    data: {
      sku: 'PRD-003',
      name: 'Keyboard Mechanical Keychron K2',
      description: 'Keyboard mechanical wireless',
      unit: 'PCS',
      price: 1800000,
      cost: 1400000,
      quantityOnHand: 3, // Low stock
      reorderPoint: 8,
      isActive: true,
    },
  })

  console.log('✅ Products created')

  // Create a purchase
  const purchase1 = await prisma.purchase.create({
    data: {
      purchaseNo: 'PO-00001',
      supplierId: supplier1.id,
      totalAmount: 32000000,
      notes: 'Initial stock purchase',
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 10,
            unitCost: 15000000,
            subtotal: 150000000,
          },
          {
            productId: product2.id,
            quantity: 25,
            unitCost: 1200000,
            subtotal: 30000000,
          },
          {
            productId: product3.id,
            quantity: 3,
            unitCost: 1400000,
            subtotal: 4200000,
          },
        ],
      },
    },
  })

  console.log('✅ Initial purchase created')

  // Create an order
  const order1 = await prisma.order.create({
    data: {
      orderNo: 'ORD-00001',
      customerId: customer1.id,
      userId: user.id,
      status: 'PENDING',
      totalAmount: 20300000,
      notes: 'Order untuk kantor pusat',
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
            unitPrice: 18000000,
            subtotal: 18000000,
          },
          {
            productId: product2.id,
            quantity: 2,
            unitPrice: 1500000,
            subtotal: 3000000,
          },
        ],
      },
    },
  })

  console.log('✅ Sample order created')

  console.log('🎉 Seed completed!')
  console.log('\n📧 Login credentials:')
  console.log('Admin: admin@erp.test / Admin123!')
  console.log('User:  user@erp.test / User123!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
