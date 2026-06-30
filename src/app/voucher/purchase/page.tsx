"use client";

import { useState } from "react";

export default function PurchaseVoucher() {
  const companyId =
    typeof window !== "undefined"
      ? localStorage.getItem("companyId")
      : "";

  const [voucherNo, setVoucherNo] = useState("");
  const [voucherDate, setVoucherDate] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [supplierLedger, setSupplierLedger] = useState("");
  const [purchaseLedger, setPurchaseLedger] = useState("");
  const [narration, setNarration] = useState("");

  const [items, setItems] = useState([
    {
      stock_item_id: "",
      quantity: "",
      rate: "",
      gst_percentage: "",
      amount: "",
    },
  ]);

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
    const response = await fetch(
      "http://localhost:5000/api/voucher/purchase/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_id: companyId,
          voucher_no: voucherNo,
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

    const data = await response.json();

    if (data.success) {
      alert("Purchase Voucher Saved");
    } else {
      alert(data.message);
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
            className="border p-3 rounded"
            placeholder="Voucher Number"
            value={voucherNo}
            onChange={(e) =>
              setVoucherNo(e.target.value)
            }
          />

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

          <input
            className="border p-3 rounded"
            placeholder="Supplier Ledger ID"
            value={supplierLedger}
            onChange={(e) =>
              setSupplierLedger(e.target.value)
            }
          />

          <input
            className="border p-3 rounded"
            placeholder="Purchase Ledger ID"
            value={purchaseLedger}
            onChange={(e) =>
              setPurchaseLedger(e.target.value)
            }
          />

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
                Stock Item ID
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

                  <input
                    className="w-full p-2"
                    value={item.stock_item_id}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "stock_item_id",
                        e.target.value
                      )
                    }
                  />

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