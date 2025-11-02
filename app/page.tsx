import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Welcome to NextPorto</h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage your business operations efficiently
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customers Card */}
        <Link href="/customers" className="block">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Customers</h2>
                <p className="text-sm text-gray-600">Manage your customer base</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Suppliers Card */}
        <Link href="/suppliers" className="block">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Suppliers</h2>
                <p className="text-sm text-gray-600">Track your suppliers</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Orders Card */}
        <Link href="/orders" className="block">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
                <p className="text-sm text-gray-600">Manage your orders</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-3xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-3xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Total Suppliers</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded">
            <div className="text-3xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
        </div>
      </div>
    </div>
  );
}
