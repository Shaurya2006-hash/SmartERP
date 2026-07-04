"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/app/config/api";
interface Ledger {
  id: number;
  ledger_name: string;
  ledger_type: string;
}

interface StockItem {
  id: number;
  item_name: string;
  gst_percentage?: number;
}

export default function PurchaseVoucher() {
  const companyId =
    typeof window !== "undefined"
      ? localStorage.getItem("companyId")
      : "";

  const [voucherDate, setVoucherDate] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [supplierLedger, setSupplierLedger] = useState<number | "">("");
  const [purchaseLedger, setPurchaseLedger] = useState<number | "">("");
  const [narration, setNarration] = useState("");

  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);

  const [items, setItems] = useState([
    {
      stock_item_id: "",
      quantity: "",
      rate: "",
      gst_percentage: "",
      amount: "",
    },
  ]);

  useEffect(() => {
    loadLedgers();
    loadStockItems();
  }, []);

  const loadLedgers = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/ledger/all/${companyId}`
      );

      const data = await res.json();

      if (data.success) {
        setLedgers(data.ledgers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadStockItems = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/stock-item/all/${companyId}`
      );

      const data = await res.json();

      if (data.success) {
        setStockItems(data.stockItems);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Only ledgers marked as "Supplier" show up in the Supplier dropdown
  const supplierLedgers = ledgers.filter(
    (l) => l.ledger_type === "Supplier"
  );

  // Only ledgers marked as "Purchase" show up in the Purchase Ledger dropdown
  const purchaseLedgers = ledgers.filter(
    (l) => l.ledger_type === "Purchase"
  );

  const addRow = () => {
    setItems([
      ...items,
      {
        stock_item_id: "",
        quantity: "",
        rate: "",
        gst_percentage: "",
        amount: "",
      },
    ]);
  };

  const updateItem = (
    index: number,
    field: string,
    value: string
  ) => {
    const temp = [...items];

    temp[index] = {
      ...temp[index],
      [field]: value,
    };

    if (field === "stock_item_id") {
      const selected = stockItems.find(
        (s) => s.id === parseInt(value)
      );
      if (selected) {
        temp[index].gst_percentage = String(
          selected.gst_percentage || 0
        );
      }
    }

    if (
      field === "quantity" ||
      field === "rate"
    ) {
      const qty =
        Number(temp[index].quantity) || 0;

      const rate =
        Number(temp[index].rate) || 0;

      temp[index].amount = String(qty * rate);
    }

    setItems(temp);
  };

  const total = items.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const saveVoucher = async () => {
    try {
      // Required field checks
      if (!voucherDate || !referenceNo) {
        alert("Please fill required fields");
        return;
      }

      if (!supplierLedger) {
        alert("Please select a Supplier");
        return;
      }

      if (!purchaseLedger) {
        alert("Please select a Purchase Ledger");
        return;
      }

      if (!items.length) {
        alert("Add at least one item");
        return;
      }

      const voucherResponse = await fetch(
        `${API_BASE_URL}/api/voucher/purchase/create`,
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
            total_amount: total,
            entries: [
              {
                ledger_id: purchaseLedger,
                debit: total,
                credit: 0,
              },
              {
                ledger_id: supplierLedger,
                debit: 0,
                credit: total,
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

      const subtotal = total;

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

      // Look up the actual supplier ledger so we store the NAME,
      // not the ID, on the invoice.
      const selectedSupplier = ledgers.find(
        (l) => Number(l.id) === Number(supplierLedger)
      );

      if (!selectedSupplier) {
        alert("Supplier not selected properly");
        return;
      }

      console.log("Supplier:", selectedSupplier);
      console.log("Items:", items);
      console.log("Total:", total);

      const invoiceResponse = await fetch(
        `${API_BASE_URL}/api/invoice/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_id: companyId,
            document_type: "Purchase Invoice",
            invoice_date: voucherDate,
            customer_name: selectedSupplier.ledger_name,
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
          `Purchase Voucher ${voucherData.voucher.voucher_no} Saved & Purchase Invoice Generated`
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
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        Purchase Voucher
      </h1>

      <div className="bg-white rounded-lg shadow p-6">

        <div className="grid grid-cols-2 gap-4">

          <input
            type="date"
            className="border p-3 rounded"
            value={voucherDate}
            onChange={(e) =>
              setVoucherDate(e.target.value)
            }
          />

          <input
            className="border p-3 rounded"
            placeholder="Reference Number"
            value={referenceNo}
            onChange={(e) =>
              setReferenceNo(e.target.value)
            }
          />

          {/* Supplier Dropdown */}

          <select
            className="border p-3 rounded"
            value={supplierLedger}
            onChange={(e) =>
              setSupplierLedger(Number(e.target.value))
            }
          >
            <option value="">
              Select Supplier
            </option>

            {supplierLedgers.map((ledger) => (
              <option
                key={ledger.id}
                value={ledger.id}
              >
                {ledger.ledger_name}
              </option>
            ))}
          </select>

          {/* Purchase Ledger Dropdown */}

          <select
            className="border p-3 rounded"
            value={purchaseLedger}
            onChange={(e) =>
              setPurchaseLedger(Number(e.target.value))
            }
          >
            <option value="">
              Select Purchase Ledger
            </option>

            {purchaseLedgers.map((ledger) => (
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
          placeholder="Narration"
          value={narration}
          onChange={(e) =>
            setNarration(e.target.value)
          }
        />

        <h2 className="text-xl font-bold mt-8 mb-4">
          Purchase Items
        </h2>

        <table className="w-full border">

          <thead>

            <tr className="bg-gray-200">

              <th className="border p-2">
                Item
              </th>

              <th className="border p-2">
                Quantity
              </th>

              <th className="border p-2">
                Rate
              </th>

              <th className="border p-2">
                GST %
              </th>

              <th className="border p-2">
                Amount
              </th>

            </tr>

          </thead>

          <tbody>

            {items.map((item, index) => (

              <tr key={index}>

                <td className="border">

                  <select
                    className="w-full p-2"
                    value={item.stock_item_id}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "stock_item_id",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select Item
                    </option>

                    {stockItems.map((stock) => (
                      <option
                        key={stock.id}
                        value={stock.id}
                      >
                        {stock.item_name}
                      </option>
                    ))}
                  </select>

                </td>

                <td className="border">

                  <input
                    className="w-full p-2"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "quantity",
                        e.target.value
                      )
                    }
                  />

                </td>

                <td className="border">

                  <input
                    className="w-full p-2"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "rate",
                        e.target.value
                      )
                    }
                  />

                </td>

                <td className="border">

                  <input
                    className="w-full p-2"
                    value={item.gst_percentage}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "gst_percentage",
                        e.target.value
                      )
                    }
                  />

                </td>

                <td className="border text-center">
                  {item.amount}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <button
          onClick={addRow}
          className="bg-green-600 text-white px-4 py-2 rounded mt-4"
        >
          Add Item
        </button>

        <h2 className="text-2xl font-bold mt-6">
          Total : ₹ {total}
        </h2>

        <button
          onClick={saveVoucher}
          className="bg-blue-600 text-white px-6 py-3 rounded mt-6"
        >
          Save Purchase Voucher
        </button>

      </div>

    </div>
  );
}