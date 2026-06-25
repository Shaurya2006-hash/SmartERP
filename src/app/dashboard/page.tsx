"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [companyName, setCompanyName] =
    useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const company =
      localStorage.getItem("companyName");

    if (company) {
      setCompanyName(company);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("companyId");
    localStorage.removeItem("companyName");

    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            SmartERP
          </h1>
          <p className="text-gray-500">
            Company: {companyName}
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-gray-900 text-white p-5">
          <h2 className="text-xl font-bold mb-6">
            Menu
          </h2>

          <ul className="space-y-4">
            <li className="cursor-pointer hover:text-blue-400">
              Dashboard
            </li>

            <li className="cursor-pointer hover:text-blue-400">
              Masters
            </li>

            <li className="cursor-pointer hover:text-blue-400">
              Transactions
            </li>

            <li className="cursor-pointer hover:text-blue-400">
              Inventory
            </li>

            <li className="cursor-pointer hover:text-blue-400">
              Accounting
            </li>

            <li className="cursor-pointer hover:text-blue-400">
              GST
            </li>

            <li className="cursor-pointer hover:text-blue-400">
              Reports
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <h2 className="text-3xl font-bold mb-8">
            Dashboard
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold">
                Total Ledgers
              </h3>
              <p className="text-3xl font-bold mt-2">
                0
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold">
                Stock Items
              </h3>
              <p className="text-3xl font-bold mt-2">
                0
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold">
                Vouchers
              </h3>
              <p className="text-3xl font-bold mt-2">
                0
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold">
                Users
              </h3>
              <p className="text-3xl font-bold mt-2">
                1
              </p>
            </div>
          </div>

          <div className="mt-10 bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">
              Welcome to SmartERP
            </h3>

            <p className="text-gray-600">
              Company Selected:{" "}
              <span className="font-bold">
                {companyName}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}