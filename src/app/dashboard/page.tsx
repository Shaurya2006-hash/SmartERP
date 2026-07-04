"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/app/config/api";
export default function Dashboard() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");

  // Existing master counts
  const [ledgerCount, setLedgerCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [stockGroupCount, setStockGroupCount] = useState(0);
  const [unitCount, setUnitCount] = useState(0);
  const [stockItemCount, setStockItemCount] = useState(0);

  const loadDashboard = async () => {
    const companyId = localStorage.getItem("companyId");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dashboard/${companyId}`
      );

      const data = await response.json();

      if (data.success) {
        setLedgerCount(data.ledgerCount);
        setGroupCount(data.groupCount);
        setStockGroupCount(data.stockGroupCount);
        setUnitCount(data.unitCount);
        setStockItemCount(data.stockItemCount);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const company = localStorage.getItem("companyName");

    if (company) {
      setCompanyName(company);
    }

    loadDashboard();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("companyId");
    localStorage.removeItem("companyName");

    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">SmartERP</h1>

          <p className="text-gray-600 mt-1">
            Company :
            <span className="font-semibold ml-2">
              {companyName || "No Company Selected"}
            </span>
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 min-h-screen bg-gray-900 text-white overflow-y-auto">

          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold">SmartERP</h2>
            <p className="text-sm text-gray-400 mt-1">
              Business Management System
            </p>
          </div>

          <nav className="p-4 space-y-2">

            {/* Dashboard */}
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              📊 Dashboard
            </button>

            {/* Masters */}
            <div className="pt-4">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                Masters
              </p>

              <button
                onClick={() => router.push("/company")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700"
              >
                🏢 Companies
              </button>

              <button
                onClick={() => router.push("/masters/groups")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700"
              >
                📂 Ledger Groups
              </button>

              <button
                onClick={() => router.push("/masters/ledgers")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700"
              >
                📒 Ledgers
              </button>
            </div>

            {/* Inventory */}
            <div className="pt-4">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                Inventory
              </p>

              <button
                onClick={() => router.push("/masters/stock-groups")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700"
              >
                📁 Stock Groups
              </button>

              <button
                onClick={() => router.push("/masters/units")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700"
              >
                📏 Units
              </button>

              <button
                onClick={() => router.push("/masters/stock-items")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700"
              >
                📦 Stock Items
              </button>
            </div>

            {/* Vouchers */}
            <div className="pt-4">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                Vouchers
              </p>

              <button
                onClick={() => router.push("/voucher/payment")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700"
              >
                💳 Payment Voucher
              </button>

              <button
                onClick={() => router.push("/voucher/receipt")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700"
              >
                💰 Receipt Voucher
              </button>

              <button
                onClick={() => router.push("/voucher/journal")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700"
              >
                📘 Journal Voucher
              </button>

              <button
                onClick={() => router.push("/voucher/purchase")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700"
              >
                🛒 Purchase Voucher
              </button>

              <button
                onClick={() => router.push("/voucher/sales")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700"
              >
                🧾 Sales Voucher
              </button>
            </div>

            {/* Billing */}
            <div className="pt-4">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                Billing
              </p>

              <button
                onClick={() => router.push("/billing/invoices")}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700"
              >
                🧾 GST Invoice
              </button>
            </div>
          </nav>

        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">

          {/* Existing Master Counts */}
          <div className="grid md:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold">Ledgers</h3>
              <p className="text-3xl mt-2 font-bold text-orange-600">
                {ledgerCount}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold">Groups</h3>
              <p className="text-3xl mt-2 font-bold text-green-600">
                {groupCount}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold">Stock Groups</h3>
              <p className="text-3xl mt-2 font-bold text-blue-600">
                {stockGroupCount}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold">Units</h3>
              <p className="text-3xl mt-2 font-bold text-purple-600">
                {unitCount}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold">Stock Items</h3>
              <p className="text-3xl mt-2 font-bold text-red-600">
                {stockItemCount}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow mt-10 p-8">
            <h2 className="text-2xl font-bold mb-4">Welcome to SmartERP</h2>

            <p className="text-gray-700 text-lg">
              Selected Company :
              <span className="font-bold text-blue-700 ml-2">
                {companyName || "No Company Selected"}
              </span>
            </p>

            <p className="mt-4 text-gray-600">
              Use the menu on the left to manage Companies, Groups, Ledgers,
              Inventory, Transactions, Billing, Accounting, GST and Reports.
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}
