"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  RefreshCw,
  KeyRound,
  Check,
  MapPin,
  ExternalLink,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Change password modal state
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [currentPassInput, setCurrentPassInput] = useState("");
  const [newPassInput, setNewPassInput] = useState("");
  const [confirmPassInput, setConfirmPassInput] = useState("");
  const [changePassMsg, setChangePassMsg] = useState({ text: "", isError: false });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [showExitToast, setShowExitToast] = useState(false);

  // Function to hash string using SHA-256 for private browser storage
  const hashString = async (str: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const fetchLiveOrders = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch live orders:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("explode_admin_session");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLiveOrders();
    }
  }, [isAuthenticated, fetchLiveOrders]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("explode_admin_session", "true");
        setErrorMsg("");
      } else {
        setErrorMsg(data.message || "Incorrect admin passcode. Access denied.");
      }
    } catch {
      setErrorMsg("Network error connecting to verification server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode(""); // Clear password input completely
    setErrorMsg("");
    sessionStorage.removeItem("explode_admin_session");
    setShowExitToast(true);
    setTimeout(() => {
      setShowExitToast(false);
    }, 3500);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassInput.length < 6) {
      setChangePassMsg({ text: "New password must be at least 6 characters.", isError: true });
      return;
    }

    if (newPassInput !== confirmPassInput) {
      setChangePassMsg({ text: "New passwords do not match.", isError: true });
      return;
    }

    try {
      const res = await fetch("/api/admin/change-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPasscode: currentPassInput.trim(),
          newPasscode: newPassInput.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setChangePassMsg({
          text: data.message || "Passcode updated successfully! Old passcode deactivated.",
          isError: false,
        });

        // Clean local storage
        localStorage.removeItem("explode_custom_admin_hash");

        setCurrentPassInput("");
        setNewPassInput("");
        setConfirmPassInput("");

        setTimeout(() => {
          setShowChangePassModal(false);
          setChangePassMsg({ text: "", isError: false });
        }, 2000);
      } else {
        setChangePassMsg({
          text: data.message || "Failed to update passcode.",
          isError: true,
        });
      }
    } catch {
      setChangePassMsg({
        text: "Server error occurred while updating passcode.",
        isError: true,
      });
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // 1. Login Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-4 relative">
        {/* Goodbye Exit Toast Notification */}
        {showExitToast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#465137] text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold">
              You have been locked out safely. Goodbye!
            </span>
          </div>
        )}

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

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Admin Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoComplete="new-password"
                name="admin_secret_key"
                autoFocus
                className="w-full text-center tracking-widest text-lg font-mono py-3 px-4 bg-[#FAF7F2] border border-[#D7C5A5] rounded-2xl focus:outline-hidden focus:border-[#465137] text-[#292B26]"
              />
              {errorMsg && (
                <p className="text-xs text-red-600 mt-2 font-medium">
                  {errorMsg}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !passcode}
              className="w-full py-3.5 bg-[#465137] hover:bg-[#68734B] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-colors shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Verifying..." : "Unlock Dashboard"}
            </button>
          </form>

          <div className="pt-2">
            <Link
              href="/en"
              className="text-xs text-[#77786F] hover:text-[#292B26] transition-colors underline"
            >
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered orders list
  const filteredOrders = orders.filter((order) => {
    const custName = order.customer?.full_name || order.delivery_address?.full_name || "";
    const custPhone = order.customer?.canonical_phone || order.delivery_address?.phone || "";
    const orderNum = order.order_number || "";

    const matchesSearch =
      orderNum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      custName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      custPhone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate live stats
  const totalDeliveredRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const uniqueCustomersCount = new Set(
    orders.map((o) => o.customer?.canonical_phone || o.delivery_address?.phone).filter(Boolean)
  ).size;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#292B26]">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-[#465137] text-white px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif font-black tracking-widest text-lg text-[#FAF7F2]">
              EXPLODE BD
            </span>
            <span className="bg-[#D7C5A5] text-[#292B26] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={fetchLiveOrders}
              disabled={isRefreshing}
              className="text-[#D7C5A5] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer font-medium bg-white/10 px-3 py-1.5 rounded-full"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
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
              target="_blank"
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
              Store Overview and Management
            </h1>
            <p className="text-xs sm:text-sm text-[#77786F] mt-1">
              Live database orders, customer records, and order fulfillment.
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
              ৳ {totalDeliveredRevenue.toLocaleString()}
            </p>
            <span className="text-[11px] text-[#77786F]">
              From completed orders
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D7C5A5]/50 shadow-xs">
            <div className="flex items-center justify-between text-[#77786F] text-xs">
              <span>Pending Orders</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-2">
              {pendingCount}
            </p>
            <span className="text-[11px] text-[#77786F]">
              Awaiting packaging and dispatch
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
              Live in Supabase
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D7C5A5]/50 shadow-xs">
            <div className="flex items-center justify-between text-[#77786F] text-xs">
              <span>Total Customers</span>
              <Users className="w-4 h-4 text-[#68734B]" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-[#292B26] mt-2">
              {uniqueCustomersCount}
            </p>
            <span className="text-[11px] text-[#77786F]">
              Unique buyer profiles
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
                Real customer orders appear here the moment they place them on the website.
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
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#77786F] flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[#292B26]">
                {orders.length === 0 ? "No Orders in Database" : "No Orders Found"}
              </h3>
              <p className="text-xs text-[#77786F] max-w-sm mx-auto">
                {orders.length === 0
                  ? "Your store is live and ready! When a customer places an order on explodebd.com, it will immediately show up here."
                  : "No orders match your current search or status filter."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-[#465137] font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-6">Order ID</th>
                    <th className="py-3.5 px-6">Customer and Phone</th>
                    <th className="py-3.5 px-6">Delivery Address</th>
                    <th className="py-3.5 px-6">Items Ordered</th>
                    <th className="py-3.5 px-6">Total (BDT)</th>
                    <th className="py-3.5 px-6">Payment</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D7C5A5]/20 text-[#292B26]">
                  {filteredOrders.map((order) => {
                    const custName =
                      order.customer?.full_name ||
                      order.delivery_address?.full_name ||
                      "Guest Customer";
                    const custPhone =
                      order.customer?.canonical_phone ||
                      order.delivery_address?.phone ||
                      "";
                    const addressStr = order.delivery_address
                      ? `${order.delivery_address.address || ""}, ${
                          order.delivery_address.city_area || ""
                        }, ${order.delivery_address.district || ""}`
                      : "Standard Delivery";

                    const cleanPhone = custPhone.replace(/[^0-9]/g, "");

                    return (
                      <tr key={order.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-[#465137]">
                          {order.order_number}
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-semibold text-[#292B26]">{custName}</p>
                          <p className="text-[11px] text-[#77786F] flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-[#68734B]" />
                            <span>{custPhone}</span>
                          </p>
                        </td>
                        <td className="py-4 px-6 max-w-xs text-[#77786F]">
                          <p className="line-clamp-2 text-[11px] flex items-start gap-1">
                            <MapPin className="w-3 h-3 text-[#68734B] shrink-0 mt-0.5" />
                            <span>{addressStr}</span>
                          </p>
                          {order.delivery_address?.delivery_instructions && (
                            <p className="text-[10px] text-amber-700 italic mt-0.5">
                              Note: {order.delivery_address.delivery_instructions}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-6 max-w-xs">
                          {order.items && order.items.length > 0 ? (
                            <div className="space-y-1">
                              {order.items.map((it: any, idx: number) => (
                                <p key={idx} className="text-[11px] text-[#465137]">
                                  • {it.snapshot_title}{" "}
                                  <span className="text-[#77786F]">
                                    ({it.snapshot_color || "Standard"}) × {it.quantity}
                                  </span>
                                </p>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[#77786F]">Details in receipt</span>
                          )}
                        </td>
                        <td className="py-4 px-6 font-bold text-[#465137]">
                          ৳ {Number(order.total_amount).toLocaleString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-0.5">
                            <span className="bg-[#FAF7F2] border border-[#D7C5A5]/60 px-2 py-0.5 rounded text-[10px] font-semibold text-[#465137] uppercase">
                              {order.payment_method}
                            </span>
                            {order.delivery_address?.payment_trx_id && (
                              <p className="text-[10px] text-emerald-700 font-mono">
                                TrxID: {order.delivery_address.payment_trx_id}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="bg-white border border-[#D7C5A5]/80 text-[#292B26] text-[11px] font-semibold rounded-lg px-2 py-1 focus:outline-hidden focus:border-[#465137]"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/88${cleanPhone.startsWith("0") ? cleanPhone : "0" + cleanPhone}?text=${encodeURIComponent(
                                `Hello ${custName}, regarding your EXPLODE BD Order #${order.order_number}: `
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full text-[11px] font-semibold transition-colors"
                              title="Message customer on WhatsApp"
                            >
                              <span>Chat</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
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
