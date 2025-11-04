import { Customer, Product, Order } from './types';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readData<T>(filename: string): Promise<T[]> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeData<T>(filename: string, data: T[]): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Customer operations
export async function getCustomers(): Promise<Customer[]> {
  return readData<Customer>('customers.json');
}

export async function addCustomer(customer: Customer): Promise<Customer> {
  const customers = await getCustomers();
  customers.push(customer);
  await writeData('customers.json', customers);
  return customer;
}

export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | null> {
  const customers = await getCustomers();
  const index = customers.findIndex(c => c.id === id);

  if (index === -1) return null;

  customers[index] = { ...customers[index], ...updates };
  await writeData('customers.json', customers);
  return customers[index];
}

export async function deleteCustomer(id: string): Promise<boolean> {
  const customers = await getCustomers();
  const filtered = customers.filter(c => c.id !== id);

  if (filtered.length === customers.length) return false;

  await writeData('customers.json', filtered);
  return true;
}

// Product operations
export async function getProducts(): Promise<Product[]> {
  return readData<Product>('products.json');
}

export async function addProduct(product: Product): Promise<Product> {
  const products = await getProducts();
  products.push(product);
  await writeData('products.json', products);
  return product;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex(p => p.id === id);

  if (index === -1) return null;

  products[index] = { ...products[index], ...updates };
  await writeData('products.json', products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const filtered = products.filter(p => p.id !== id);

  if (filtered.length === products.length) return false;

  await writeData('products.json', filtered);
  return true;
}

// Order operations
export async function getOrders(): Promise<Order[]> {
  return readData<Order>('orders.json');
}

export async function addOrder(order: Order): Promise<Order> {
  const orders = await getOrders();
  orders.push(order);
  await writeData('orders.json', orders);
  return order;
}
