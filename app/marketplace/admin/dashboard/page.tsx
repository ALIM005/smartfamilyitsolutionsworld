'use client';

import React, { useState, useEffect } from 'react';

interface Order {
  id: string;
  customerName: string;
  phone: string;
  village: string;
  postalCode: string;
  address: string;
  items: string;
  totalAmountBDT: number;
  paymentMethod: string;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  date: string;
}

export default function MarketplaceAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currency, setCurrency] = useState<'BDT' | 'USD'>('BDT');
  const [notification, setNotification] = useState<string | null>(null);

  const ADMIN_USERNAME = 'Alimuddin111005';
  const ADMIN_PASSWORD = 'Alim4214$&';
  const USD_EXCHANGE_RATE = 120;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect username or password!');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchOrders() {
      try {
        setOrders([
          {
            id: 'ORD-1001',
            customerName: 'Najmin',
            phone: '01934111005',
            village: 'Uttar Para',
            postalCode: '3140',
            address: 'Sylhet, Companiganj',
            items: 'Smart Wireless Headset (x1)',
            totalAmountBDT: 7200,
            paymentMethod: 'Cash on Delivery',
            status: 'Pending',
            date: '2026-10-30',
          },
          {
            id: 'ORD-1002',
            customerName: 'Alim Uddin',
            phone: '01700000000',
            village: 'Sadar Road',
            postalCode: '3100',
            address: 'Sylhet, Sadar',
            items: 'Smart Watch (x1)',
            totalAmountBDT: 14400,
            paymentMethod: 'bKash',
            status: 'Delivered',
            date: '2026-10-29',
          },
        ]);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [isAuthenticated]);

  const sendSmsNotification = (phone: string, orderId: string, status: string) => {
    const message = `Dear customer, your order (${orderId}) status is now ${status}. Thank you for choosing Smart Marketplace!`;
    console.log(`[SMS Gateway Simulated] Sent to ${phone}: "${message}"`);
    setNotification(`Notification sent to ${phone}: "${message}"`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleStatusChange = (orderId: string, newStatus: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled') => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          if (newStatus === 'Delivered' && order.status !== 'Delivered') {
            sendSmsNotification(order.phone, order.id, 'Delivered');
          }
          return { ...order, status: newStatus };
        }
        return order;
      })
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-gray-200">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-sm text-gray-500 mt-1">Smart Marketplace Control Panel</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm text-gray-900"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 text-sm shadow-sm"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const formatAmount = (amountBDT: number) => {
    if (currency === 'USD') {
      return `$${(amountBDT / USD_EXCHANGE_RATE).toFixed(2)}`;
    }
    return `৳${amountBDT.toLocaleString('en-BD')}`;
  };

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmountBDT, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {notification && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm rounded-xl shadow-sm flex justify-between items-center animate-fade-in">
            <div>
              <span className="font-bold">Notification: </span>
              {notification}
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-emerald-700 font-bold hover:text-emerald-900 text-xs ml-4"
            >
              Close
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Smart Marketplace - Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Manage orders and monitor customer delivery
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
              <span className="text-xs text-gray-500 font-medium">Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'BDT' | 'USD')}
                className="text-xs font-semibold text-gray-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="BDT">Taka (BDT)</option>
                <option value="USD">Dollar (USD)</option>
              </select>
            </div>

            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              Marketplace Control
            </span>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{orders.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Pending Orders</p>
            <h3 className="text-3xl font-bold text-amber-600 mt-2">{pendingOrders}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Total Sales</p>
            <h3 className="text-3xl font-bold text-emerald-600 mt-2">
              {formatAmount(totalRevenue)}
            </h3>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold border-b">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer & Address</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-blue-600">{order.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.phone}</div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          Village: <span className="font-medium">{order.village}</span>, Postal Code: <span className="font-medium">{order.postalCode}</span>
                        </div>
                        <div className="text-xs text-gray-400">{order.address}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{order.items}</td>
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {formatAmount(order.totalAmountBDT)}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{order.paymentMethod}</td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as 'Pending' | 'Processing' | 'Delivered' | 'Cancelled'
                            )
                          }
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer border-none focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                            order.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Processing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => sendSmsNotification(order.phone, order.id, order.status)}
                          className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
                        >
                          Send Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}