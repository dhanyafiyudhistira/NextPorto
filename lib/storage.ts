import { Customer, Supplier, Order } from '@/types';

// Simple client-side storage using localStorage
export const storage = {
  // Customers
  getCustomers: (): Customer[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('customers');
    return data ? JSON.parse(data) : [];
  },

  saveCustomers: (customers: Customer[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('customers', JSON.stringify(customers));
  },

  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const customers = storage.getCustomers();
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    customers.push(newCustomer);
    storage.saveCustomers(customers);
    return newCustomer;
  },

  deleteCustomer: (id: string) => {
    const customers = storage.getCustomers().filter(c => c.id !== id);
    storage.saveCustomers(customers);
  },

  // Suppliers
  getSuppliers: (): Supplier[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('suppliers');
    return data ? JSON.parse(data) : [];
  },

  saveSuppliers: (suppliers: Supplier[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
  },

  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>): Supplier => {
    const suppliers = storage.getSuppliers();
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    suppliers.push(newSupplier);
    storage.saveSuppliers(suppliers);
    return newSupplier;
  },

  deleteSupplier: (id: string) => {
    const suppliers = storage.getSuppliers().filter(s => s.id !== id);
    storage.saveSuppliers(suppliers);
  },

  // Orders
  getOrders: (): Order[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('orders');
    return data ? JSON.parse(data) : [];
  },

  saveOrders: (orders: Order[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('orders', JSON.stringify(orders));
  },

  addOrder: (order: Omit<Order, 'id' | 'createdAt'>): Order => {
    const orders = storage.getOrders();
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    storage.saveOrders(orders);
    return newOrder;
  },

  updateOrderStatus: (id: string, status: Order['status']) => {
    const orders = storage.getOrders();
    const updatedOrders = orders.map(order =>
      order.id === id ? { ...order, status } : order
    );
    storage.saveOrders(updatedOrders);
  },

  deleteOrder: (id: string) => {
    const orders = storage.getOrders().filter(o => o.id !== id);
    storage.saveOrders(orders);
  },
};
