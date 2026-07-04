"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/config/api";

interface Ledger {
  id: number;
  ledger_name: string;
  ledger_type: string;
}

export default function ReceiptVoucher() {
  const companyId =
    typeof window !== "undefined"
      ? localStorage.getItem("companyId")
      : "";

  const [voucherDate, setVoucherDate] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [narration, setNarration] = useState("");
  const [amount, setAmount] = useState("");

  const [cashLedger, setCashLedger] = useState<number | "">("");
  const [customerLedger, setCustomerLedger] = useState<number | "">("");

  const [ledgers, setLedgers] = useState<Ledger[]>([]);

  useEffect(() => {
    loadLedgers();
  }, []);

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

  // Cash & Bank ledgers
  const cashBankLedgers = ledgers.filter(
    (ledger) =>
      ledger.ledger_type === "Cash" ||
      ledger.ledger_type === "Bank"
  );

  // Customer ledgers
  const customerLedgers = ledgers.filter(
    (ledger) => ledger.ledger_type === "Customer"
  );

  const saveVoucher = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/voucher/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_id: companyId,
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

        setVoucherDate("");
        setReferenceNo("");
        setNarration("");
        setAmount("");
        setCashLedger("");
        setCustomerLedger("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-6">
        Receipt Voucher
      </h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">

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

        {/* Cash / Bank Ledger */}

        <select
          className="border p-3 w-full rounded"
          value={cashLedger}
          onChange={(e) =>
            setCashLedger(Number(e.target.value))
          }
        >
          <option value="">
            Select Cash / Bank Ledger
          </option>

          {cashBankLedgers.map((ledger) => (
            <option
              key={ledger.id}
              value={ledger.id}
            >
              {ledger.ledger_name}
            </option>
          ))}
        </select>

        {/* Customer Ledger */}

        <select
          className="border p-3 w-full rounded"
          value={customerLedger}
          onChange={(e) =>
            setCustomerLedger(Number(e.target.value))
          }
        >
          <option value="">
            Select Customer Ledger
          </option>

          {customerLedgers.map((ledger) => (
            <option
              key={ledger.id}
              value={ledger.id}
            >
              {ledger.ledger_name}
            </option>
          ))}
        </select>

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