"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { API_BASE_URL } from "@/app/config/api";
export default function EditSalesVoucher() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [companyId, setCompanyId] = useState("");
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [stockItems, setStockItems] = useState<any[]>([]);

  const [voucherNo, setVoucherNo] = useState("");
  const [voucherDate, setVoucherDate] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [customerLedger, setCustomerLedger] = useState("");
  const [salesLedger, setSalesLedger] = useState("");
  const [narration, setNarration] = useState("");
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const company = localStorage.getItem("companyId");

    if (company) {
      setCompanyId(company);
      loadLedgers(company);
      loadStockItems(company);
    }

    loadVoucher();
  }, []);

  const loadLedgers = async (company: any) => {
    const response = await fetch(
      `${API_BASE_URL}/api/ledger/all/${company}`
    );
    const data = await response.json();

    if (data.success) {
      setLedgers(data.ledgers);
    }
  };

  const loadStockItems = async (company: any) => {
    const response = await fetch(
      `${API_BASE_URL}/api/stock-item/all/${company}`
    );
    const data = await response.json();

    if (data.success) {
      setStockItems(data.stockItems);
    }
  };

  const loadVoucher = async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/voucher/sales/${id}`
    );
    const data = await response.json();

    if (data.success) {
      const voucher = data.voucher;

      setVoucherNo(voucher.voucher_no);
      setVoucherDate(voucher.voucher_date.substring(0, 10));
      setReferenceNo(voucher.reference_no);
      setNarration(voucher.narration);

      if (data.entries.length >= 2) {
        setCustomerLedger(data.entries[0].ledger_id.toString());
        setSalesLedger(data.entries[1].ledger_id.toString());
      }

      setItems(data.items);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        stock_item_id: "",
        quantity: 1,
        rate: 0,
        gst_percentage: 18,
        amount: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated: any = [...items];
    updated[index][field] = value;

    const qty = Number(updated[index].quantity);
    const rate = Number(updated[index].rate);
    const gst = Number(updated[index].gst_percentage);

    const amount = qty * rate;
    updated[index].amount = amount + (amount * gst) / 100;

    setItems(updated);
  };

  const totalAmount = items.reduce(
    (sum: any, item: any) => sum + Number(item.amount),
    0
  );

  const updateVoucher = async () => {
    if (!customerLedger) {
      alert("Select Customer Ledger");
      return;
    }

    if (!salesLedger) {
      alert("Select Sales Ledger");
      return;
    }

    const body = {
      voucher_no: voucherNo,
      voucher_date: voucherDate,
      reference_no: referenceNo,
      narration,
      total_amount: totalAmount,
      entries: [
        {
          ledger_id: customerLedger,
          debit: totalAmount,
          credit: 0,
        },
        {
          ledger_id: salesLedger,
          debit: 0,
          credit: totalAmount,
        },
      ],
      items,
    };

    const response = await fetch(
      `${API_BASE_URL}/api/voucher/sales/update/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Sales Voucher Updated Successfully");
      router.push("/vouchers/sales");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-8">Edit Sales Voucher</h1>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="font-semibold">Voucher No</label>
            <input
              className="border w-full p-3 rounded mt-2"
              value={voucherNo}
              onChange={(e) => setVoucherNo(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold">Voucher Date</label>
            <input
              type="date"
              className="border w-full p-3 rounded mt-2"
              value={voucherDate}
              onChange={(e) => setVoucherDate(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold">Reference No</label>
            <input
              className="border w-full p-3 rounded mt-2"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold">Customer Ledger</label>
            <select
              className="border w-full p-3 rounded mt-2"
              value={customerLedger}
              onChange={(e) => setCustomerLedger(e.target.value)}
            >
              <option value="">Select Customer</option>
              {ledgers.map((ledger: any) => (
                <option key={ledger.id} value={ledger.id}>
                  {ledger.ledger_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">Sales Ledger</label>
            <select
              className="border w-full p-3 rounded mt-2"
              value={salesLedger}
              onChange={(e) => setSalesLedger(e.target.value)}
            >
              <option value="">Select Sales Ledger</option>
              {ledgers.map((ledger: any) => (
                <option key={ledger.id} value={ledger.id}>
                  {ledger.ledger_name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="font-semibold">Narration</label>
            <textarea
              rows={3}
              className="border w-full p-3 rounded mt-2"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow mt-8 p-8">
        <h2 className="text-2xl font-bold mb-6">Stock Items</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">Item</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>GST %</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item: any, index: number) => (
              <tr key={index}>
                <td className="p-2">
                  <select
                    className="border p-2 w-full"
                    value={item.stock_item_id}
                    onChange={(e) =>
                      handleItemChange(index, "stock_item_id", e.target.value)
                    }
                  >
                    <option value="">Select Item</option>
                    {stockItems.map((stock: any) => (
                      <option key={stock.id} value={stock.id}>
                        {stock.item_name}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <input
                    type="number"
                    className="border p-2 w-24"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className="border p-2 w-24"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(index, "rate", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className="border p-2 w-24"
                    value={item.gst_percentage}
                    onChange={(e) =>
                      handleItemChange(index, "gst_percentage", e.target.value)
                    }
                  />
                </td>

                <td>₹ {Number(item.amount).toFixed(2)}</td>

                <td>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded"
                    onClick={() => removeItem(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded"
          onClick={addItem}
        >
          + Add Item
        </button>

        <div className="text-right mt-8">
          <h2 className="text-2xl font-bold">
            Total : ₹ {totalAmount.toFixed(2)}
          </h2>
        </div>

        <div className="flex justify-end mt-8">
          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg"
            onClick={updateVoucher}
          >
            Update Sales Voucher
          </button>
        </div>
      </div>
    </div>
  );
}