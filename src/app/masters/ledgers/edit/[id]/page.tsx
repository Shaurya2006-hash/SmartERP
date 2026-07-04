"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { API_BASE_URL } from "@/app/config/api";
export default function EditLedger() {
  const router = useRouter();
  const params = useParams();

  const ledgerId = params.id;

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
    fetchLedger();
  }, []);

  const fetchGroups = async () => {
    try {
      const companyId = localStorage.getItem("companyId");

      const response = await fetch(
        `${API_BASE_URL}/api/group/all/${companyId}`
      );

      const data = await response.json();

      if (data.success) {
        setGroups(data.groups);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLedger = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ledger/${ledgerId}`
      );

      const data = await response.json();

      if (data.success) {

        const ledger = data.ledger;

        setLedgerName(ledger.ledger_name);
        setLedgerType(ledger.ledger_type);
        setGroupId(String(ledger.group_id));

        setAddress(ledger.address || "");
        setPhone(ledger.phone || "");
        setEmail(ledger.email || "");
        setGst(ledger.gst_number || "");

        setOpeningBalance(String(ledger.opening_balance));
        setBalanceType(ledger.balance_type);

      }

    } catch (error) {
      console.log(error);
    }
  };

  const updateLedger = async () => {

    try {

      const response = await fetch(
        `${API_BASE_URL}/api/ledger/update/${ledgerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
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

        alert("Ledger Updated Successfully");

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
          Edit Ledger
        </h1>

        <input
          className="border p-3 w-full mb-4 rounded"
          placeholder="Ledger Name"
          value={ledgerName}
          onChange={(e)=>setLedgerName(e.target.value)}
        />

        <select
          value={ledgerType}
          onChange={(e)=>setLedgerType(e.target.value)}
          className="border p-3 rounded w-full mb-4"
        >
          <option value="">Select Ledger Type</option>
          <option value="Customer">Customer</option>
          <option value="Supplier">Supplier</option>
          <option value="Purchase">Purchase</option>
          <option value="Cash">Cash</option>
          <option value="General">General</option>
        </select>

        <select
          className="border p-3 w-full mb-4 rounded"
          value={groupId}
          onChange={(e)=>setGroupId(e.target.value)}
        >
          <option value="">Select Group</option>

          {groups.map((group:any)=>(

            <option
              key={group.id}
              value={group.id}
            >
              {group.group_name}
            </option>

          ))}

        </select>

        <input
          className="border p-3 w-full mb-4 rounded"
          placeholder="Address"
          value={address}
          onChange={(e)=>setAddress(e.target.value)}
        />

        <input
          className="border p-3 w-full mb-4 rounded"
          placeholder="Phone Number"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
        />

        <input
          className="border p-3 w-full mb-4 rounded"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          className="border p-3 w-full mb-4 rounded"
          placeholder="GST Number"
          value={gst}
          onChange={(e)=>setGst(e.target.value)}
        />

        <input
          type="number"
          className="border p-3 w-full mb-4 rounded"
          placeholder="Opening Balance"
          value={openingBalance}
          onChange={(e)=>setOpeningBalance(e.target.value)}
        />

        <select
          className="border p-3 w-full mb-6 rounded"
          value={balanceType}
          onChange={(e)=>setBalanceType(e.target.value)}
        >
          <option value="Dr">Dr</option>
          <option value="Cr">Cr</option>
        </select>

        <button
          onClick={updateLedger}
          className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg"
        >
          Update Ledger
        </button>

      </div>

    </div>
  );
}