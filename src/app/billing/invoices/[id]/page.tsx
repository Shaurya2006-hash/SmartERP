"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { generateInvoicePDF } from "../../../utils/generateInvoicePDF";
import { API_BASE_URL } from "@/app/config/api";

interface Invoice {
  id: number;
  invoice_no: string;
  invoice_date: string;
  customer_name: string;
  customer_address: string;
  customer_gst: string;
  reference_no: string;
  narration: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  grand_total: number;
}

interface InvoiceItem {
  stock_item_id: number;
  item_name: string;
  quantity: number;
  rate: number;
  gst_percentage: number;
  amount: number;
}

interface Company {
  company_name: string;
  address: string;
  gst_number: string;
  state: string;
}

export default function ViewInvoice() {

  const router = useRouter();
  const params = useParams();

  const id = params.id;

  const [invoice, setInvoice] = useState<Invoice | null>(null);

  const [items, setItems] = useState<InvoiceItem[]>([]);

  const [company, setCompany] = useState<Company | null>(null);

  const loadInvoice = async () => {

    try {

      const response = await fetch(
        `${API_BASE_URL}/api/invoice/${id}`
      );

      const data = await response.json();

      if (data.success) {

        setInvoice(data.invoice);

        setItems(data.items);

      }

    } catch (error) {

      console.log(error);

    }

  };

  // NOTE: this assumes a GET /api/company/:companyId endpoint returning
  // { success: true, company: { company_name, company_address,
  // company_gstin, company_state } }. Check this matches your actual
  // company controller/route and adjust the URL and field names if not.
  const loadCompany = async () => {

    const companyId = localStorage.getItem("companyId");

    if (!companyId) return;

    try {

      const response = await fetch(
        `${API_BASE_URL}/api/company/${companyId}`
      );

      const data = await response.json();

      if (data.success) {

        setCompany(data.company);

      }

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    if (id) {

      loadInvoice();
      loadCompany();

    }

  }, []);

  const generateQuotation = () => {
    console.log("Generate Quotation from invoice", id);
  };

  const generateEstimate = () => {
    console.log("Generate Estimate from invoice", id);
  };

  const generateProforma = () => {
    console.log("Generate Proforma from invoice", id);
  };

  const handleDownloadPdf = () => {

    if (!invoice || !items.length || !company) {
      console.log("Invoice, items, or company data not loaded yet.");
      return;
    }

    generateInvoicePDF(company, invoice, items);

  };

  if (!invoice) {

    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="bg-white rounded-xl shadow p-8">

        <div className="flex justify-between items-center">

          <h1 className="text-3xl font-bold">
            GST Invoice
          </h1>

          <div className="flex gap-3 flex-wrap justify-end">

            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Print
            </button>

            <button
              onClick={handleDownloadPdf}
              className="bg-green-600 text-white px-5 py-2 rounded-lg"
            >
              Download PDF
            </button>

           
            <button
              onClick={() => router.push("/billing/invoices")}
              className="bg-gray-600 text-white px-5 py-2 rounded-lg"
            >
              Back
            </button>

          </div>

        </div>

        <hr className="my-6" />

        <div className="grid md:grid-cols-2 gap-8">

          <div>

            <p className="mb-2">
              <strong>Invoice No :</strong> {invoice.invoice_no}
            </p>

            <p className="mb-2">
              <strong>Date :</strong> {invoice.invoice_date}
            </p>

            <p className="mb-2">
              <strong>Reference :</strong> {invoice.reference_no}
            </p>

          </div>

          <div>

            <p className="mb-2">
              <strong>Customer :</strong> {invoice.customer_name}
            </p>

            <p className="mb-2">
              <strong>Address :</strong> {invoice.customer_address}
            </p>

            <p className="mb-2">
              <strong>GST No :</strong> {invoice.customer_gst}
            </p>

          </div>

        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">
          Invoice Items
        </h2>

        <table className="w-full border">

          <thead className="bg-blue-600 text-white">

            <tr>

              <th className="p-3">Item</th>

              <th className="p-3">Quantity</th>

              <th className="p-3">Rate</th>

              <th className="p-3">GST %</th>

              <th className="p-3">Amount</th>

            </tr>

          </thead>

          <tbody>

            {items.map((item, index) => (

              <tr key={index} className="border-b">

                <td className="p-3">
                  {item.item_name}
                </td>

                <td className="p-3">
                  {item.quantity}
                </td>

                <td className="p-3">
                  ₹ {Number(item.rate).toFixed(2)}
                </td>

                <td className="p-3">
                  {item.gst_percentage} %
                </td>

                <td className="p-3">
                  ₹ {Number(item.amount).toFixed(2)}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <div className="w-96 ml-auto mt-10">

          <div className="flex justify-between mb-2">

            <span>Subtotal</span>

            <span>
              ₹ {Number(invoice.subtotal).toFixed(2)}
            </span>

          </div>

          <div className="flex justify-between mb-2">

            <span>CGST</span>

            <span>
              ₹ {Number(invoice.cgst).toFixed(2)}
            </span>

          </div>

          <div className="flex justify-between mb-2">

            <span>SGST</span>

            <span>
              ₹ {Number(invoice.sgst).toFixed(2)}
            </span>

          </div>

          <div className="flex justify-between mb-2">

            <span>IGST</span>

            <span>
              ₹ {Number(invoice.igst).toFixed(2)}
            </span>

          </div>

          <hr className="my-3" />

          <div className="flex justify-between text-2xl font-bold">

            <span>Grand Total</span>

            <span>
              ₹ {Number(invoice.grand_total).toFixed(2)}
            </span>

          </div>

        </div>

        <div className="mt-10">

          <h3 className="font-bold text-lg">
            Narration
          </h3>

          <p className="mt-2 text-gray-700">
            {invoice.narration}
          </p>

        </div>

      </div>

    </div>

  );
}