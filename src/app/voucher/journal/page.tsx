"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/config/api";

interface Ledger {
  id: number;
  ledger_name: string;
}

export default function JournalVoucher() {
  const companyId =
    typeof window !== "undefined"
      ? localStorage.getItem("companyId")
      : "";

  const [voucherDate, setVoucherDate] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [narration, setNarration] = useState("");
  const [amount, setAmount] = useState("");

  const [debitLedger, setDebitLedger] = useState<number | "">("");
  const [creditLedger, setCreditLedger] = useState<number | "">("");

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

        setVoucherDate("");
        setReferenceNo("");
        setNarration("");
        setAmount("");
        setDebitLedger("");
        setCreditLedger("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
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
            type="number"
            className="border p-3 rounded"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div></div>

          {/* Debit Ledger */}

          <select
            className="border p-3 rounded"
            value={debitLedger}
            onChange={(e) =>
              setDebitLedger(Number(e.target.value))
            }
          >
            <option value="">
              Select Debit Ledger
            </option>

            {ledgers.map((ledger) => (
              <option
                key={ledger.id}
                value={ledger.id}
              >
                {ledger.ledger_name}
              </option>
            ))}
          </select>

          {/* Credit Ledger */}

          <select
            className="border p-3 rounded"
            value={creditLedger}
            onChange={(e) =>
              setCreditLedger(Number(e.target.value))
            }
          >
            <option value="">
              Select Credit Ledger
            </option>

            {ledgers.map((ledger) => (
              <option
                key={ledger.id}
                value={ledger.id}
              >
                {ledger.ledger_name}
              </option>
            ))}
          </select>

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