'use client';

import { useState, useEffect } from 'react';
import { Customer, Product, OrderItem } from '@/lib/types';

export default function CreateOrderPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [notes, setNotes] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    quantity: 1,
  });

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchCustomers = async () => {
    const response = await fetch('/api/customers');
    const data = await response.json();
    setCustomers(data);
  };

  const fetchProducts = async () => {
    const response = await fetch('/api/products');
    const data = await response.json();
    setProducts(data);
  };

  const addOrderItem = () => {
    if (!currentItem.productId || currentItem.quantity <= 0) {
      alert('Please select a product and enter a valid quantity');
      return;
    }

    const product = products.find((p) => p.id === currentItem.productId);
    if (!product) return;

    const newItem: OrderItem = {
      productId: currentItem.productId,
      quantity: currentItem.quantity,
      price: product.price,
    };

    setOrderItems([...orderItems, newItem]);
    setCurrentItem({ productId: '', quantity: 1 });
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomer) {
      alert('Please select a customer');
      return;
    }

    if (orderItems.length === 0) {
      alert('Please add at least one product to the order');
      return;
    }

    const orderData = {
      customerId: selectedCustomer,
      notes,
      items: orderItems,
      total: calculateTotal(),
    };

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      alert('Order created successfully!');
      setSelectedCustomer('');
      setNotes('');
      setOrderItems([]);
      setCurrentItem({ productId: '', quantity: 1 });
    } else {
      alert('Failed to create order');
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : 'Unknown';
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : 'Unknown';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Order</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Information</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Customer*</label>
            <select
              required
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select customer</option>
              {customers.length === 0 ? (
                <option disabled>No customers available - Add customers first</option>
              ) : (
                customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.email})
                  </option>
                ))
              )}
            </select>
            {customers.length === 0 && (
              <p className="text-sm text-red-500 mt-1">
                No customers found. Please{' '}
                <a href="/admin/customers" className="underline">
                  add customers
                </a>{' '}
                first.
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
              placeholder="Add any notes about this order..."
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Product</label>
              <select
                value={currentItem.productId}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, productId: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select product</option>
                {products.length === 0 ? (
                  <option disabled>No products available - Add products first</option>
                ) : (
                  products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (${product.price.toFixed(2)})
                    </option>
                  ))
                )}
              </select>
              {products.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  No products found. Please{' '}
                  <a href="/admin/products" className="underline">
                    add products
                  </a>{' '}
                  first.
                </p>
              )}
            </div>

            <div className="w-32">
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={currentItem.quantity}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={addOrderItem}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Item
              </button>
            </div>
          </div>

          {orderItems.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Product</th>
                    <th className="text-right py-2">Quantity</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Subtotal</th>
                    <th className="text-right py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{getProductName(item.productId)}</td>
                      <td className="text-right py-2">{item.quantity}</td>
                      <td className="text-right py-2">${item.price.toFixed(2)}</td>
                      <td className="text-right py-2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="text-right py-2">
                        <button
                          type="button"
                          onClick={() => removeOrderItem(index)}
                          className="text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} className="text-right py-2 font-semibold">
                      Total:
                    </td>
                    <td className="text-right py-2 font-semibold">
                      ${calculateTotal().toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {orderItems.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No items added yet. Add products to the order above.
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={customers.length === 0 || products.length === 0}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Create Order
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedCustomer('');
              setNotes('');
              setOrderItems([]);
              setCurrentItem({ productId: '', quantity: 1 });
            }}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>

        {(customers.length === 0 || products.length === 0) && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800">
              <strong>Note:</strong> You need to add both customers and products before
              you can create an order.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
