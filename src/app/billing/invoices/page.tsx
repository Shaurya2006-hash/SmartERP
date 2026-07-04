"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/app/config/api";

interface Invoice {
  id: number;
  invoice_no: string;
  invoice_date: string;
  customer_name: string;
  grand_total: number;
  status: string;
}

export default function InvoicePage() {
  const router = useRouter();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");

  const companyId =
    typeof window !== "undefined"
      ? localStorage.getItem("companyId")
      : "";

  const loadInvoices = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/invoice/all/${companyId}`
      );

      const data = await response.json();

      if (data.success) {
        setInvoices(data.invoices);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (companyId) {
      loadInvoices();
    }
  }, []);

  const searchInvoice = async () => {
    if (search === "") {
      loadInvoices();
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/invoice/search?invoiceNo=${search}`
    );

    const data = await response.json();

    if (data.success) {
      setInvoices(data.invoices);
    }
  };

  const deleteInvoice = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmDelete) return;

    await fetch(
      `${API_BASE_URL}/api/invoice/delete/${id}`,
      {
        method: "DELETE",
      }
    );

    loadInvoices();
  };

  // Placeholder for PDF generation - wire this up to your actual PDF generator
  const generatePdf = (id: number) => {
    console.log("Generate PDF for invoice", id);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          GST Invoice Register
        </h1>

      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-6">

        <div className="flex gap-4">

          <input
            type="text"
            placeholder="Search Invoice Number..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border rounded-lg px-4 py-2 w-full"
          />

          <button
            onClick={searchInvoice}
            className="bg-green-600 text-white px-5 rounded-lg"
          >
            Search
          </button>

        </div>

      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-blue-600 text-white">

            <tr>

              <th className="p-3 text-left">
                Invoice No
              </th>

              <th className="p-3 text-left">
                Date
              </th>

              <th className="p-3 text-left">
                Customer
              </th>

              <th className="p-3 text-left">
                Grand Total
              </th>

              <th className="p-3 text-left">
                Status
              </th>

              <th className="p-3 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {invoices.map((invoice) => (

              <tr
                key={invoice.id}
                className="border-b"
              >

                <td className="p-3">
                  {invoice.invoice_no}
                </td>

                <td className="p-3">
                  {invoice.invoice_date}
                </td>

                <td className="p-3">
                  {invoice.customer_name}
                </td>

                <td className="p-3">
                  ₹ {invoice.grand_total}
                </td>

                <td className="p-3">
                  {invoice.status}
                </td>

                <td className="p-3">

                  <div className="flex gap-2 justify-center">

                    <button
                      onClick={() =>
                        router.push(
                          `/billing/invoices/${invoice.id}`
                        )
                      }
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        deleteInvoice(invoice.id)
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() =>
                        window.print()
                      }
                      className="bg-purple-600 text-white px-3 py-1 rounded"
                    >
                      Print
                    </button>

                    <button
                      onClick={() =>
                        generatePdf(invoice.id)
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      PDF
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}