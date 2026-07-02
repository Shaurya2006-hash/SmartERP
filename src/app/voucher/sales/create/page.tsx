"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Ledger {
  id: number;
  ledger_name: string;
  ledger_type: string;
}

interface StockItem {
  id: number;
  item_name: string;
  rate?: number;
  gst_percentage?: number;
}

export default function CreateSalesVoucherPage() {
  const router = useRouter();

  const companyId =
    typeof window !== "undefined"
      ? localStorage.getItem("companyId")
      : "";

  // Voucher Details
  const [voucherDate, setVoucherDate] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [narration, setNarration] = useState("");

  // Ledgers
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [customerLedger, setCustomerLedger] = useState("");
  const [salesLedger, setSalesLedger] = useState("");

  // Stock Items
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [items, setItems] = useState<any[]>([]);

  // Only ledgers marked as "Customer" show up in the Customer dropdown
  const customerLedgers = ledgers.filter(
    (l) => l.ledger_type === "Customer"
  );

  // Fetch Ledgers
  useEffect(() => {
    const fetchLedgers = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/ledger/all/${companyId}`
        );
        const data = await res.json();
        if (data.success) {
          setLedgers(data.ledgers);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchLedgers();
  }, []);

  // Fetch Stock Items
  useEffect(() => {
    const fetchStockItems = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/stock-item/all/${companyId}`
        );
        const data = await res.json();
        if (data.success) {
          setStockItems(data.stockItems);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchStockItems();
  }, []);

  // Add new blank item row
  const addItemRow = () => {
    setItems([
      ...items,
      {
        stock_item_id: "",
        quantity: 0,
        rate: 0,
        gst_percentage: 0,
        amount: 0,
      },
    ]);
  };

  // Delete item row
  const deleteItemRow = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  // Calculate amount for a single row (with GST)
  const calculateRowAmount = (quantity: number, rate: number, gst: number) => {
    const base = quantity * rate;
    const gstAmount = (base * gst) / 100;
    return base + gstAmount;
  };

  // Handle field changes in item row
  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "stock_item_id") {
      const selected = stockItems.find(
        (s) => s.id === parseInt(value)
      );
      if (selected) {
        updated[index].rate = selected.rate || 0;
        updated[index].gst_percentage = selected.gst_percentage || 0;
      }
    }

    const quantity = parseFloat(updated[index].quantity) || 0;
    const rate = parseFloat(updated[index].rate) || 0;
    const gst = parseFloat(updated[index].gst_percentage) || 0;

    updated[index].amount = calculateRowAmount(quantity, rate, gst);

    setItems(updated);
  };

  // Total Amount
  const totalAmount = items.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );

  // Save Voucher
  const saveVoucher = async () => {
    try {
      if (!customerLedger) {
        alert("Please select a Customer Ledger");
        return;
      }

      if (!salesLedger) {
        alert("Please select a Sales Ledger");
        return;
      }

      const voucherResponse = await fetch(
        "http://localhost:5000/api/voucher/sales/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_id: companyId,
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
          }),
        }
      );

      const voucherData = await voucherResponse.json();

      if (!voucherData.success) {
        alert(voucherData.message);
        return;
      }

      const subtotal = totalAmount;

      const totalGST = items.reduce(
        (sum, item) =>
          sum +
          ((Number(item.amount) || 0) *
            (Number(item.gst_percentage) || 0)) /
            100,
        0
      );

      const cgst = totalGST / 2;
      const sgst = totalGST / 2;
      const igst = 0;

      const grandTotal = subtotal + cgst + sgst + igst;

      // Look up the actual customer ledger so we store the NAME,
      // not the ID, on the invoice.
      const selectedCustomer = ledgers.find(
        (l) => String(l.id) === String(customerLedger)
      );

      const invoiceResponse = await fetch(
        "http://localhost:5000/api/invoice/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_id: companyId,
            document_type: "GST Invoice",
            invoice_date: voucherDate,
            customer_name:
              selectedCustomer?.ledger_name || "",
            customer_address: "",
            customer_gst: "",
            reference_no: referenceNo,
            narration,
            subtotal,
            cgst,
            sgst,
            igst,
            grand_total: grandTotal,
            items,
          }),
        }
      );

      const invoiceData = await invoiceResponse.json();

      if (invoiceData.success) {
        alert(
          `Sales Voucher ${voucherData.voucher.voucher_no} Saved & GST Invoice Generated`
        );

        window.location.href = "/billing/invoices";
      } else {
        alert(invoiceData.message);
      }
    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Sales Voucher</h1>

      {/* Voucher Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium">Voucher Date</label>
          <input
            type="date"
            className="border rounded-lg w-full p-2"
            value={voucherDate}
            onChange={(e) => setVoucherDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Reference No</label>
          <input
            type="text"
            className="border rounded-lg w-full p-2"
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value)}
          />
        </div>

        <div className="col-span-2">
          <label className="block mb-1 font-medium">Narration</label>
          <input
            type="text"
            className="border rounded-lg w-full p-2"
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
          />
        </div>
      </div>

      {/* Customer Ledger & Sales Ledger */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium">Customer Ledger</label>
          <select
            className="border rounded-lg w-full p-2"
            value={customerLedger}
            onChange={(e) => setCustomerLedger(e.target.value)}
          >
            <option value="">Select Customer Ledger</option>
            {customerLedgers.map((ledger) => (
              <option key={ledger.id} value={ledger.id}>
                {ledger.ledger_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Sales Ledger</label>
          <select
            className="border rounded-lg w-full p-2"
            value={salesLedger}
            onChange={(e) => setSalesLedger(e.target.value)}
          >
            <option value="">Select Sales Ledger</option>
            {ledgers.map((ledger) => (
              <option key={ledger.id} value={ledger.id}>
                {ledger.ledger_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stock Item Table */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Stock Items</h2>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
            onClick={addItemRow}
          >
            + Add Item
          </button>
        </div>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Stock Item</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">GST %</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">
                  <select
                    className="border rounded-lg w-full p-1"
                    value={item.stock_item_id}
                    onChange={(e) =>
                      handleItemChange(index, "stock_item_id", e.target.value)
                    }
                  >
                    <option value="">Select Item</option>
                    {stockItems.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.item_name}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="border p-2">
                  <input
                    type="number"
                    className="border rounded-lg w-full p-1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                  />
                </td>

                <td className="border p-2">
                  <input
                    type="number"
                    className="border rounded-lg w-full p-1"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(index, "rate", e.target.value)
                    }
                  />
                </td>

                <td className="border p-2">
                  <input
                    type="number"
                    className="border rounded-lg w-full p-1"
                    value={item.gst_percentage}
                    onChange={(e) =>
                      handleItemChange(index, "gst_percentage", e.target.value)
                    }
                  />
                </td>

                <td className="border p-2 text-right">
                  {Number(item.amount).toFixed(2)}
                </td>

                <td className="border p-2 text-center">
                  <button
                    className="text-red-600 font-semibold"
                    onClick={() => deleteItemRow(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Amount */}
      <div className="flex justify-end mb-6">
        <div className="text-xl font-bold">
          Total Amount: ₹{totalAmount.toFixed(2)}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          className="bg-blue-600 text-white px-8 py-3 rounded-lg"
          onClick={saveVoucher}
        >
          Save Sales Voucher
        </button>
      </div>
    </div>
  );
}