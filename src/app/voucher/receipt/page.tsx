"use client";

import { useState } from "react";

export default function ReceiptVoucher() {
  const companyId =
    typeof window !== "undefined"
      ? localStorage.getItem("companyId")
      : "";

  const [voucherNo, setVoucherNo] = useState("");
  const [voucherDate, setVoucherDate] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [narration, setNarration] = useState("");
  const [amount, setAmount] = useState("");
  const [cashLedger, setCashLedger] = useState("");
  const [customerLedger, setCustomerLedger] = useState("");

  const saveVoucher = async () => {
    const response = await fetch(
      "http://localhost:5000/api/voucher/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_id: companyId,
          voucher_no: voucherNo,
          voucher_type: "Receipt",
          voucher_date: voucherDate,
          reference_no: referenceNo,
          narration,
          total_amount: Number(amount),
          entries: [
            {
              ledger_id: cashLedger,
              debit: Number(amount),
              credit: 0,
            },
            {
              ledger_id: customerLedger,
              debit: 0,
              credit: Number(amount),
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Receipt Voucher Saved Successfully");

      setVoucherNo("");
      setVoucherDate("");
      setReferenceNo("");
      setNarration("");
      setAmount("");
      setCashLedger("");
      setCustomerLedger("");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Receipt Voucher
      </h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">

        <input
          className="border p-3 w-full rounded"
          placeholder="Voucher Number"
          value={voucherNo}
          onChange={(e) => setVoucherNo(e.target.value)}
        />

        <input
          type="date"
          className="border p-3 w-full rounded"
          value={voucherDate}
          onChange={(e) => setVoucherDate(e.target.value)}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="Reference Number"
          value={referenceNo}
          onChange={(e) => setReferenceNo(e.target.value)}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="Cash/Bank Ledger ID"
          value={cashLedger}
          onChange={(e) => setCashLedger(e.target.value)}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="Customer Ledger ID"
          value={customerLedger}
          onChange={(e) => setCustomerLedger(e.target.value)}
        />

        <input
          type="number"
          className="border p-3 w-full rounded"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <textarea
          className="border p-3 w-full rounded"
          placeholder="Narration"
          value={narration}
          onChange={(e) => setNarration(e.target.value)}
        />

        <button
          onClick={saveVoucher}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
        >
          Save Receipt Voucher
        </button>

      </div>

    </div>
  );
}