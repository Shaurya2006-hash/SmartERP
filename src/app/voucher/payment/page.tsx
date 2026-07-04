"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/config/api";

interface Ledger {
  id: number;
  ledger_name: string;
}

export default function PaymentVoucher() {

  const companyId = typeof window !== "undefined" ? localStorage.getItem("companyId") : "";

  const [voucherNo, setVoucherNo] = useState("");
  const [date, setDate] = useState("");
  const [reference, setReference] = useState("");
  const [narration, setNarration] = useState("");
  const [amount, setAmount] = useState("");
  const [fromLedger, setFromLedger] = useState("");
  const [toLedger, setToLedger] = useState("");

  const [ledgers, setLedgers] = useState<Ledger[]>([]);

  // NOTE: this assumes a GET /api/ledger/all/:companyId endpoint returning
  // { success: true, ledgers: [{ id, ledger_name }, ...] }.
  // Check this matches your actual ledger controller/route and adjust
  // the URL and field names if not.
  const loadLedgers = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ledger/all/${companyId}`
      );

      const data = await response.json();

      if (data.success) {
        setLedgers(data.ledgers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (companyId) {
      loadLedgers();
    }
  }, []);

  const saveVoucher = async () => {

    const response = await fetch(
      `${API_BASE_URL}/api/voucher/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({

          company_id: companyId,

          voucher_no: voucherNo,

          voucher_type: "Payment",

          voucher_date: date,

          reference_no: reference,

          narration,

          total_amount: amount,

          entries: [

            {
              ledger_id: fromLedger,
              debit: parseFloat(amount),
              credit: 0,
            },

            {
              ledger_id: toLedger,
              debit: 0,
              credit: parseFloat(amount),
            },

          ],

        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Payment Voucher Saved");
    }

  };

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Payment Voucher
      </h1>

      <input
        placeholder="Voucher No"
        className="border p-3 w-full mb-4"
        value={voucherNo}
        onChange={(e) => setVoucherNo(e.target.value)}
      />

      <input
        type="date"
        className="border p-3 w-full mb-4"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        placeholder="Reference"
        className="border p-3 w-full mb-4"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
      />

      <select
        className="border p-3 w-full mb-4"
        value={fromLedger}
        onChange={(e) => setFromLedger(e.target.value)}
      >
        <option value="">Select From Ledger</option>
        {ledgers.map((ledger) => (
          <option key={ledger.id} value={ledger.id}>
            {ledger.ledger_name}
          </option>
        ))}
      </select>

      <select
        className="border p-3 w-full mb-4"
        value={toLedger}
        onChange={(e) => setToLedger(e.target.value)}
      >
        <option value="">Select To Ledger</option>
        {ledgers.map((ledger) => (
          <option key={ledger.id} value={ledger.id}>
            {ledger.ledger_name}
          </option>
        ))}
      </select>

      <input
        placeholder="Amount"
        className="border p-3 w-full mb-4"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <textarea
        placeholder="Narration"
        className="border p-3 w-full mb-4"
        value={narration}
        onChange={(e) => setNarration(e.target.value)}
      />

      <button
        onClick={saveVoucher}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Save Voucher
      </button>

    </div>

  );
}