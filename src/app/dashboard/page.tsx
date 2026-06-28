"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [ledgerCount, setLedgerCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [stockGroupCount, setStockGroupCount] = useState(0);
  const [unitCount, setUnitCount] = useState(0);
  const [stockItemCount, setStockItemCount] = useState(0);

  const loadDashboard = async () => {
    const companyId = localStorage.getItem("companyId");

    const response = await fetch(
      `http://localhost:5000/api/dashboard/${companyId}`
    );

    const data = await response.json();

    if (data.success) {
      setLedgerCount(data.ledgerCount);
      setGroupCount(data.groupCount);
      setStockGroupCount(data.stockGroupCount);
      setUnitCount(data.unitCount);
      setStockItemCount(data.stockItemCount);
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
        <aside className="w-64 min-h-screen bg-gray-900 text-white">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold">Menu</h2>
          </div>

          <nav className="p-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full text-left px-4 py-3 rounded hover:bg-gray-700"
            >
              📊 Dashboard
            </button>

            <p className="mt-6 mb-2 text-gray-400 font-semibold">Masters</p>

            <button
              onClick={() => router.push("/company")}
              className="w-full text-left px-4 py-3 rounded hover:bg-gray-700"
            >
              🏢 Companies
            </button>

            <button
              onClick={() => router.push("/masters/groups")}
              className="w-full text-left px-4 py-3 rounded hover:bg-gray-700"
            >
              📂 Groups
            </button>

            <button
              onClick={() => router.push("/masters/ledgers")}
              className="w-full text-left px-4 py-3 rounded hover:bg-gray-700"
            >
              📒 Ledgers
            </button>

            <p className="mt-6 mb-2 text-gray-400 font-semibold">
              Transactions
            </p>

            <button className="w-full text-left px-4 py-3 rounded hover:bg-gray-700">
              Sales Voucher
            </button>

            <button className="w-full text-left px-4 py-3 rounded hover:bg-gray-700">
              Purchase Voucher
            </button>

            <button className="w-full text-left px-4 py-3 rounded hover:bg-gray-700">
              Payment Voucher
            </button>

            <button className="w-full text-left px-4 py-3 rounded hover:bg-gray-700">
              Receipt Voucher
            </button>

            {/* Inventory */}
            <p className="mt-6 mb-2 text-gray-400 font-semibold">Inventory</p>

            <button
              onClick={() => router.push("/masters/stock-groups")}
              className="w-full text-left px-4 py-3 rounded hover:bg-gray-700"
            >
              📂 Stock Groups
            </button>

            <button
              onClick={() => router.push("/masters/units")}
              className="w-full text-left px-4 py-3 rounded hover:bg-gray-700"
            >
              📏 Units
            </button>

            <button
              onClick={() => router.push("/masters/stock-items")}
              className="w-full text-left px-4 py-3 rounded hover:bg-gray-700"
            >
              📦 Stock Items
            </button>

            <p className="mt-6 mb-2 text-gray-400 font-semibold">Accounting</p>

            <button className="w-full text-left px-4 py-3 rounded hover:bg-gray-700">
              Trial Balance
            </button>

            <button className="w-full text-left px-4 py-3 rounded hover:bg-gray-700">
              Balance Sheet
            </button>

            <button className="w-full text-left px-4 py-3 rounded hover:bg-gray-700">
              Profit & Loss
            </button>

            <p className="mt-6 mb-2 text-gray-400 font-semibold">GST</p>

            <button className="w-full text-left px-4 py-3 rounded hover:bg-gray-700">
              GST Reports
            </button>

            <p className="mt-6 mb-2 text-gray-400 font-semibold">Reports</p>

            <button className="w-full text-left px-4 py-3 rounded hover:bg-gray-700">
              Ledger Report
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <h2 className="text-4xl font-bold mb-8">Dashboard</h2>

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
              Inventory, Transactions, Accounting, GST and Reports.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}