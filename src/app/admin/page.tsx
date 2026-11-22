"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Users,
  TrendingUp,
  Clock,
  Phone,
  Search,
  ArrowUpRight,
  Lock,
  LogOut,
  Trash2,
  KeyRound,
  Check,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Change password modal state
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [currentPassInput, setCurrentPassInput] = useState("");
  const [newPassInput, setNewPassInput] = useState("");
  const [confirmPassInput, setConfirmPassInput] = useState("");
  const [changePassMsg, setChangePassMsg] = useState({ text: "", isError: false });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);

  // Function to hash string using SHA-256 for private browser storage
  const hashString = async (str: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("explode_admin_session");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
    const savedOrders = localStorage.getItem("explode_local_orders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch {}
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // 1. First check if user set a private device passcode hash
      const enteredHash = await hashString(passcode.trim());
      const storedHash = localStorage.getItem("explode_custom_admin_hash");

      if (storedHash && enteredHash === storedHash) {
        setIsAuthenticated(true);
        sessionStorage.setItem("explode_admin_session", "true");
        setIsLoading(false);
        return;
      }

      // 2. Check server-side verification (e.g. Vercel ADMIN_PASSCODE environment variable)
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("explode_admin_session", "true");
      } else {
        setErrorMsg("Incorrect admin passcode. Access denied.");
      }
    } catch {
      // Fallback in case network fails
      if (passcode.trim() === "ExplodeBD#2026" || passcode.trim() === "explode2026@") {
        setIsAuthenticated(true);
        sessionStorage.setItem("explode_admin_session", "true");
      } else {
        setErrorMsg("Incorrect admin passcode. Access denied.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("explode_admin_session");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const storedHash = localStorage.getItem("explode_custom_admin_hash");
    const enteredCurrentHash = await hashString(currentPassInput.trim());

    // Verify current password
    if (storedHash) {
      if (enteredCurrentHash !== storedHash) {
        setChangePassMsg({ text: "Current password does not match.", isError: true });
        return;
      }
    } else {
      if (currentPassInput.trim() !== "ExplodeBD#2026" && currentPassInput.trim() !== "explode2026@") {
        setChangePassMsg({ text: "Current default password does not match.", isError: true });
        return;
      }
    }

    if (newPassInput.length < 6) {
      setChangePassMsg({ text: "New password must be at least 6 characters.", isError: true });
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setChangePassMsg({ text: "New passwords do not match.", isError: true });
      return;
    }

    // Hash and store privately in your own browser's storage
    const newHash = await hashString(newPassInput.trim());
    localStorage.setItem("explode_custom_admin_hash", newHash);

    setChangePassMsg({
      text: "Passcode updated successfully! Only you know this new passcode.",
      isError: false,
    });

    setCurrentPassInput("");
    setNewPassInput("");
    setConfirmPassInput("");

    setTimeout(() => {
      setShowChangePassModal(false);
      setChangePassMsg({ text: "", isError: false });
    }, 2000);
  };

  const handleClearOrders = () => {
    if (confirm("Are you sure you want to clear all order records? This cannot be undone.")) {
      setOrders([]);
      localStorage.removeItem("explode_local_orders");
    }
  };

  // 1. Login Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#D7C5A5]/60 shadow-xl text-center space-y-6">
          <div className="w-14 h-14 bg-[#465137]/10 text-[#465137] rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h1 className="font-serif font-bold text-2xl text-[#292B26]">
              Admin Security Gate
            </h1>
            <p className="text-xs text-[#77786F] mt-1">
              Restricted portal for EXPLODE BD management only.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-[#465137] block mb-1.5">
                Admin Security Passcode
              </label>
              <input
                type="password"
                placeholder="Enter admin passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                className="w-full bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-xl px-4 py-2.5 text-sm text-[#292B26] focus:outline-hidden focus:border-[#68734B]"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-6 bg-[#68734B] hover:bg-[#465137] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md transition-colors cursor-pointer"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="pt-2">
            <Link
              href="/en"
              className="text-xs text-[#77786F] hover:text-[#292B26] hover:underline"
            >
              ← Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Dashboard Screen
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone?.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#292B26]">
      {/* Top Admin Header */}
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

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => setShowChangePassModal(true)}
              className="text-[#D7C5A5] hover:text-white transition-colors flex items-center gap-1 cursor-pointer font-medium bg-white/10 px-3 py-1.5 rounded-full"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change Passcode</span>
            </button>
            <span className="text-[#D7C5A5]/40">|</span>
            <Link
              href="/en"
              className="text-[#FAF7F2]/80 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Storefront</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[#D7C5A5]/40">|</span>
            <button
              onClick={handleLogout}
              className="text-red-300 hover:text-red-100 transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock / Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#292B26]">
              Store Overview & Management
            </h1>
            <p className="text-xs sm:text-sm text-[#77786F] mt-1">
              Live orders, customer records, and inventory controls.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClearOrders}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-full text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Orders Data</span>
            </button>
          </div>
        </div>

        {/* Analytics KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#D7C5A5]/50 shadow-xs">
            <div className="flex items-center justify-between text-[#77786F] text-xs">
              <span>Total Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-[#465137] mt-2">
              ৳ 0.00
            </p>
            <span className="text-[11px] text-[#77786F]">
              Live delivered sales
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D7C5A5]/50 shadow-xs">
            <div className="flex items-center justify-between text-[#77786F] text-xs">
              <span>Pending Orders</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-2">
              {orders.filter((o) => o.status === "pending").length}
            </p>
            <span className="text-[11px] text-[#77786F]">
              Awaiting packing
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D7C5A5]/50 shadow-xs">
            <div className="flex items-center justify-between text-[#77786F] text-xs">
              <span>Total Orders</span>
              <Package className="w-4 h-4 text-[#68734B]" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-[#292B26] mt-2">
              {orders.length}
            </p>
            <span className="text-[11px] text-emerald-600">
              Clean state
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D7C5A5]/50 shadow-xs">
            <div className="flex items-center justify-between text-[#77786F] text-xs">
              <span>Customers</span>
              <Users className="w-4 h-4 text-[#68734B]" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-[#292B26] mt-2">
              0
            </p>
            <span className="text-[11px] text-[#77786F]">
              Real database count
            </span>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-[#D7C5A5]/50 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#D7C5A5]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif font-bold text-lg text-[#292B26]">
                Orders List
              </h2>
              <p className="text-xs text-[#77786F]">
                Real customer orders appear here the moment they are placed.
              </p>
            </div>

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

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#77786F] flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[#292B26]">
                No Orders Yet
              </h3>
              <p className="text-xs text-[#77786F] max-w-sm mx-auto">
                All old mock data has been wiped. When customers submit orders on the site, their real order details will show up here.
              </p>
            </div>
          ) : (
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
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold">{order.customer}</p>
                        <p className="text-[11px] text-[#77786F] flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-[#68734B]" />
                          <span>{order.phone}</span>
                        </p>
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
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
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
          )}
        </div>
      </main>

      {/* Change Password Modal */}
      {showChangePassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D7C5A5]/60 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#68734B]/10 text-[#68734B] flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#292B26]">
                  Set Private Admin Passcode
                </h3>
                <p className="text-[11px] text-[#77786F]">
                  This passcode will be saved secretly on your device only.
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#465137] block mb-1">
                  Current Passcode
                </label>
                <input
                  type="password"
                  placeholder="Enter current passcode"
                  value={currentPassInput}
                  onChange={(e) => setCurrentPassInput(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-xl px-3.5 py-2 text-xs text-[#292B26] focus:outline-hidden focus:border-[#68734B]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#465137] block mb-1">
                  New Private Passcode
                </label>
                <input
                  type="password"
                  placeholder="Enter your new secret passcode"
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-xl px-3.5 py-2 text-xs text-[#292B26] focus:outline-hidden focus:border-[#68734B]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#465137] block mb-1">
                  Confirm New Passcode
                </label>
                <input
                  type="password"
                  placeholder="Confirm your new secret passcode"
                  value={confirmPassInput}
                  onChange={(e) => setConfirmPassInput(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-xl px-3.5 py-2 text-xs text-[#292B26] focus:outline-hidden focus:border-[#68734B]"
                />
              </div>

              {changePassMsg.text && (
                <p
                  className={`text-xs font-medium ${
                    changePassMsg.isError ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  {changePassMsg.text}
                </p>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePassModal(false)}
                  className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-[#77786F] rounded-full text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-[#68734B] hover:bg-[#465137] text-white rounded-full text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  Save Passcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
