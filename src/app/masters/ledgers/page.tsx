"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LedgerPage() {
  const router = useRouter();

  const [ledgers, setLedgers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLedgers();
  }, []);

  const fetchLedgers = async () => {
    const companyId = localStorage.getItem("companyId");

    const response = await fetch(
      `http://localhost:5000/api/ledger/all/${companyId}`
    );

    const data = await response.json();

    if (data.success) {
      setLedgers(data.ledgers);
    }
  };

  const deleteLedger = async (id: number) => {
    if (!confirm("Delete this ledger?")) return;

    await fetch(
      `http://localhost:5000/api/ledger/delete/${id}`,
      {
        method: "DELETE",
      }
    );

    fetchLedgers();
  };

  const searchLedger = async (value: string) => {
    setSearch(value);

    if (value === "") {
      fetchLedgers();
      return;
    }

    const response = await fetch(
      `http://localhost:5000/api/ledger/search?name=${value}`
    );

    const data = await response.json();

    if (data.success) {
      setLedgers(data.ledgers);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Ledger Management
        </h1>

        <button
          onClick={() =>
            router.push("/masters/ledgers/create")
          }
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          + Create Ledger
        </button>
      </div>

      <input
        type="text"
        placeholder="Search Ledger"
        value={search}
        onChange={(e) =>
          searchLedger(e.target.value)
        }
        className="border p-3 w-full mb-6 rounded"
      />

      <div className="grid md:grid-cols-3 gap-6">
        {ledgers.map((ledger: any) => (
          <div
            key={ledger.id}
            className="bg-white rounded-xl shadow p-5"
          >
            <h2 className="text-xl font-bold">
              {ledger.ledger_name}
            </h2>

            <p>{ledger.ledger_type}</p>

            <p>{ledger.phone}</p>

            <p>{ledger.email}</p>

            <p>
              ₹ {ledger.opening_balance}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() =>
                  router.push(
                    `/masters/ledgers/edit/${ledger.id}`
                  )
                }
                className="bg-yellow-500 text-white px-3 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteLedger(ledger.id)
                }
                className="bg-red-600 text-white px-3 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}