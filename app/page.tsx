export default function Home() {
  return (
    <div className="min-h-screen">
      <h1 className="text-4xl font-bold mb-4">NextPorto ERP System</h1>
      <p className="text-xl mb-6">Welcome to the Enterprise Resource Planning System</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/admin/customers" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-2">Manage Customers</h2>
          <p className="text-gray-600">Add, edit, and view customers</p>
        </a>

        <a href="/admin/products" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-2">Manage Products</h2>
          <p className="text-gray-600">Add, edit, and view products</p>
        </a>

        <a href="/orders/create" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-2">Create Order</h2>
          <p className="text-gray-600">Create new orders with customers and products</p>
        </a>
      </div>
    </div>
  );
}
