"use client";

import { useState } from "react";

export default function JournalVoucher() {
  const companyId =
    typeof window !== "undefined"
      ? localStorage.getItem("companyId")
      : "";

  const [voucherNo, setVoucherNo] = useState("");
  const [voucherDate, setVoucherDate] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [narration, setNarration] = useState("");
  const [debitLedger, setDebitLedger] = useState("");
  const [creditLedger, setCreditLedger] = useState("");
  const [amount, setAmount] = useState("");

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
          voucher_type: "Journal",
          voucher_date: voucherDate,
          reference_no: referenceNo,
          narration,
          total_amount: Number(amount),

          entries: [
            {
              ledger_id: debitLedger,
              debit: Number(amount),
              credit: 0,
            },
            {
              ledger_id: creditLedger,
              debit: 0,
              credit: Number(amount),
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Journal Voucher Saved Successfully");

      setVoucherNo("");
      setVoucherDate("");
      setReferenceNo("");
      setNarration("");
      setDebitLedger("");
      setCreditLedger("");
      setAmount("");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        Journal Voucher
      </h1>

      <div className="bg-white rounded-lg shadow p-6">

        <div className="grid grid-cols-2 gap-4">

          <input
            className="border p-3 rounded"
            placeholder="Voucher Number"
            value={voucherNo}
            onChange={(e) => setVoucherNo(e.target.value)}
          />

          <input
            type="date"
            className="border p-3 rounded"
            value={voucherDate}
            onChange={(e) => setVoucherDate(e.target.value)}
          />

          <input
            className="border p-3 rounded"
            placeholder="Reference Number"
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value)}
          />

          <input
            className="border p-3 rounded"
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            className="border p-3 rounded"
            placeholder="Debit Ledger ID"
            value={debitLedger}
            onChange={(e) => setDebitLedger(e.target.value)}
          />

          <input
            className="border p-3 rounded"
            placeholder="Credit Ledger ID"
            value={creditLedger}
            onChange={(e) => setCreditLedger(e.target.value)}
          />

        </div>

        <textarea
          className="border p-3 rounded w-full mt-4"
          rows={4}
          placeholder="Narration"
          value={narration}
          onChange={(e) => setNarration(e.target.value)}
        />

        <button
          onClick={saveVoucher}
          className="bg-blue-600 text-white px-6 py-3 rounded mt-6 hover:bg-blue-700"
        >
          Save Journal Voucher
        </button>

      </div>

    </div>
  );
}