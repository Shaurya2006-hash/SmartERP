"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateLedger() {
  const router = useRouter();

  const [ledgerName, setLedgerName] = useState("");
  const [ledgerType, setLedgerType] = useState("Customer");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gst, setGst] = useState("");
  const [openingBalance, setOpeningBalance] =
    useState("");
  const [balanceType, setBalanceType] =
    useState("Dr");

  const createLedger = async () => {
    const companyId =
      localStorage.getItem("companyId");

    const response = await fetch(
      "http://localhost:5000/api/ledger/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_id: companyId,
          ledger_name: ledgerName,
          ledger_type: ledgerType,
          address,
          phone,
          email,
          gst_number: gst,
          opening_balance: openingBalance,
          balance_type: balanceType,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Ledger Created");

      router.push("/masters/ledgers");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white w-[700px] p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6">
          Create Ledger
        </h1>

        <input
          className="border p-3 w-full mb-4"
          placeholder="Ledger Name"
          value={ledgerName}
          onChange={(e) =>
            setLedgerName(e.target.value)
          }
        />

        <select
          className="border p-3 w-full mb-4"
          value={ledgerType}
          onChange={(e) =>
            setLedgerType(e.target.value)
          }
        >
          <option>Customer</option>
          <option>Supplier</option>
          <option>Stock Item</option>
        </select>

        <input
          className="border p-3 w-full mb-4"
          placeholder="Address"
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
        />

        <input
          className="border p-3 w-full mb-4"
          placeholder="Phone"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        />

        <input
          className="border p-3 w-full mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          className="border p-3 w-full mb-4"
          placeholder="GST Number"
          value={gst}
          onChange={(e) =>
            setGst(e.target.value)
          }
        />

        <input
          className="border p-3 w-full mb-4"
          placeholder="Opening Balance"
          value={openingBalance}
          onChange={(e) =>
            setOpeningBalance(e.target.value)
          }
        />

        <select
          className="border p-3 w-full mb-6"
          value={balanceType}
          onChange={(e) =>
            setBalanceType(e.target.value)
          }
        >
          <option>Dr</option>
          <option>Cr</option>
        </select>

        <button
          onClick={createLedger}
          className="bg-blue-600 text-white w-full py-3 rounded"
        >
          Create Ledger
        </button>
      </div>
    </div>
  );
}