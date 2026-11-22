"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  Phone,
  Search,
  Filter,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Simulated live state backed by Supabase
  const stats = {
    totalRevenue: "৳ 42,500",
    totalOrders: 28,
    pendingOrders: 4,
    deliveredOrders: 21,
    totalCustomers: 26,
    vipCustomers: 5,
  };

  const orders = [
    {
      id: "EX-391820",
      customer: "Sumaiya Akter",
      phone: "01711-234567",
      items: "Ribbed Jersey Ready Hijab (Olive Green) x 2",
      total: "৳ 1,380",
      status: "pending",
      paymentMethod: "COD",
      date: "Just now",
      district: "Dhaka",
    },
    {
      id: "EX-391819",
      customer: "Nusrat Jahan",
      phone: "01822-987654",
      items: "Two-Piece Prayer Salat Suit (White) x 1",
      total: "৳ 1,930",
      status: "confirmed",
      paymentMethod: "bKash",
      date: "25 mins ago",
      district: "Chittagong",
    },
    {
      id: "EX-391815",
      customer: "Farhana Islam",
      phone: "01933-456789",
      items: "Premium Mosscrepe Long Hijab (Navy) x 1",
      total: "৳ 930",
      status: "delivered",
      paymentMethod: "COD",
      date: "Yesterday",
      district: "Dhaka",
    },
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#292B26]">
      {/* Top Admin Navigation Bar */}
      <header className="bg-[#465137] text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-xl tracking-wide">
              EXPLODE BD
            </span>
            <span className="bg-[#D7C5A5] text-[#292B26] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/en"
              className="text-[#FAF7F2]/80 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>View Storefront</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[#D7C5A5]">|</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Database Connected
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#292B26]">
              Store Overview & Management
            </h1>
            <p className="text-xs sm:text-sm text-[#77786F] mt-1">
              Live orders, customer segmentation, and inventory overview.
            </p>
          </div>
        </div>

        {/* Analytics KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#D7C5A5]/50 shadow-xs">
            <div className="flex items-center justify-between text-[#77786F] text-xs">
              <span>Delivered Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-[#465137] mt-2">
              {stats.totalRevenue}
            </p>
            <span className="text-[11px] text-emerald-600 font-medium">
              Net valid sales
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D7C5A5]/50 shadow-xs">
            <div className="flex items-center justify-between text-[#77786F] text-xs">
              <span>Pending Orders</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-2">
              {stats.pendingOrders}
            </p>
            <span className="text-[11px] text-[#77786F]">
              Needs packing & dispatch
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D7C5A5]/50 shadow-xs">
            <div className="flex items-center justify-between text-[#77786F] text-xs">
              <span>Total Orders</span>
              <Package className="w-4 h-4 text-[#68734B]" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-[#292B26] mt-2">
              {stats.totalOrders}
            </p>
            <span className="text-[11px] text-emerald-600">
              {stats.deliveredOrders} Delivered
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D7C5A5]/50 shadow-xs">
            <div className="flex items-center justify-between text-[#77786F] text-xs">
              <span>Customers</span>
              <Users className="w-4 h-4 text-[#68734B]" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-[#292B26] mt-2">
              {stats.totalCustomers}
            </p>
            <span className="text-[11px] text-[#465137] font-semibold">
              {stats.vipCustomers} VIP Sisterhood
            </span>
          </div>
        </div>

        {/* Live Orders Manager */}
        <div className="bg-white rounded-3xl border border-[#D7C5A5]/50 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#D7C5A5]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-[#292B26]">
                Recent Orders
              </h2>
              <p className="text-xs text-[#77786F]">
                Real-time orders received via website and WhatsApp.
              </p>
            </div>

            {/* Search & Filters */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#77786F] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer, phone, order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-full pl-9 pr-4 py-1.5 text-xs text-[#292B26] focus:outline-hidden focus:border-[#68734B]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-full px-3 py-1.5 text-xs text-[#292B26] focus:outline-hidden"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#465137] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Items</th>
                  <th className="py-3.5 px-6">Total</th>
                  <th className="py-3.5 px-6">Payment</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D7C5A5]/20 text-[#292B26]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#465137]">
                      {order.id}
                      <span className="block text-[10px] font-sans font-normal text-[#77786F]">
                        {order.date}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold">{order.customer}</p>
                      <p className="text-[11px] text-[#77786F] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-[#68734B]" />
                        <span>{order.phone}</span>
                      </p>
                      <span className="text-[10px] text-[#68734B] font-medium">
                        {order.district}
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate text-[#77786F]">
                      {order.items}
                    </td>
                    <td className="py-4 px-6 font-bold text-[#465137]">
                      {order.total}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-[#FAF7F2] border border-[#D7C5A5]/60 px-2 py-0.5 rounded text-[10px] font-semibold text-[#465137]">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : order.status === "confirmed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <a
                        href={`https://wa.me/88${order.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full text-[11px] font-semibold transition-colors"
                      >
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
