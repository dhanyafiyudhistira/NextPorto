export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  products: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}
