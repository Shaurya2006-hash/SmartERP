"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateLedger() {
  const router = useRouter();

  const [ledgerName, setLedgerName] = useState("");
  const [ledgerType, setLedgerType] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [groupId, setGroupId] = useState("");

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gst, setGst] = useState("");

  const [openingBalance, setOpeningBalance] = useState("");

  const [balanceType, setBalanceType] = useState("Dr");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const companyId = localStorage.getItem("companyId");

      const response = await fetch(
        `http://localhost:5000/api/group/all/${companyId}`
      );

      const data = await response.json();

      if (data.success) {
        setGroups(data.groups);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createLedger = async () => {
    try {
      const companyId = localStorage.getItem("companyId");

      const response = await fetch(
        "http://localhost:5000/api/ledger/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_id: companyId,
            group_id: groupId,
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
        alert("Ledger Created Successfully");
        router.push("/masters/ledgers");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
      <div className="bg-white w-[700px] p-8 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold mb-6">
          Create Ledger
        </h1>

        {/* Ledger Name */}

        <input
          className="border p-3 w-full mb-4 rounded"
          placeholder="Ledger Name"
          value={ledgerName}
          onChange={(e) => setLedgerName(e.target.value)}
        />

        {/* Ledger Type */}

        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Ledger Type
          </label>

          <select
            value={ledgerType}
            onChange={(e) => setLedgerType(e.target.value)}
            className="border p-3 rounded w-full"
          >
            <option value="">Select Ledger Type</option>
            <option value="Customer">Customer</option>
            <option value="Supplier">Supplier</option>
            <option value="Bank">Bank</option>
            <option value="Cash">Cash</option>
            <option value="General">General</option>
          </select>
        </div>

        {/* Group Dropdown */}

        <select
          className="border p-3 w-full mb-4 rounded"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        >
          <option value="">Select Group</option>

          {groups.map((group: any) => (
            <option
              key={group.id}
              value={group.id}
            >
              {group.group_name}
            </option>
          ))}
        </select>

        {/* Address */}

        <input
          className="border p-3 w-full mb-4 rounded"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* Phone */}

        <input
          className="border p-3 w-full mb-4 rounded"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* Email */}

        <input
          className="border p-3 w-full mb-4 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* GST */}

        <input
          className="border p-3 w-full mb-4 rounded"
          placeholder="GST Number"
          value={gst}
          onChange={(e) => setGst(e.target.value)}
        />

        {/* Opening Balance */}

        <input
          type="number"
          className="border p-3 w-full mb-4 rounded"
          placeholder="Opening Balance"
          value={openingBalance}
          onChange={(e) => setOpeningBalance(e.target.value)}
        />

        {/* Balance Type */}

        <select
          className="border p-3 w-full mb-6 rounded"
          value={balanceType}
          onChange={(e) => setBalanceType(e.target.value)}
        >
          <option value="Dr">Dr</option>
          <option value="Cr">Cr</option>
        </select>

        {/* Button */}

        <button
          onClick={createLedger}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg"
        >
          Create Ledger
        </button>

      </div>
    </div>
  );
}