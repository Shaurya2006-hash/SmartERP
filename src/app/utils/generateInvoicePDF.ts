import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Company {
  company_name: string;
  address: string;
  gst_number: string;
  state: string;
}

interface Invoice {
  invoice_no: string;
  invoice_date: string;
  customer_name: string;
  customer_address: string;
  customer_gst: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  grand_total: number;
}

interface InvoiceItem {
  item_name: string;
  quantity: number;
  rate: number;
  gst_percentage: number;
  amount: number;
}

// jsPDF's built-in fonts (helvetica/times/courier) don't have a glyph for
// the ₹ symbol (U+20B9). Passing it to doc.text() with those fonts corrupts
// the PDF's text stream and produces garbled output like "&S&u&b&t&o&t&a&l&".
// Using "Rs." avoids the corruption entirely since it's plain ASCII.
// If you want the actual ₹ glyph, embed a Unicode font instead - see the
// comment near the bottom of this file for how to do that.
const CURRENCY = "Rs.";

const formatDate = (isoDate: string) => {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate; // fallback if it isn't a valid date
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const generateInvoicePDF = (
  company: Company,
  invoice: Invoice,
  items: InvoiceItem[]
) => {

  const doc = new jsPDF();

  // ===== Title =====

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("TAX INVOICE", 105, 15, { align: "center" });

  // ===== Outer Border =====

  doc.rect(10, 20, 190, 260);

  // ===== Company + Invoice Details =====

  doc.rect(10, 20, 110, 40);
  doc.rect(120, 20, 80, 40);

  doc.setFontSize(12);
  console.log("customer_name value:", invoice.customer_name, typeof invoice.customer_name);
doc.text(invoice.customer_name || "-", 14, 76);
  doc.text(company.company_name || "-", 14, 28);
  doc.setFontSize(10);
  doc.text(company.address || "-", 14, 35);
doc.text(`GSTIN : ${company.gst_number || "-"}`, 14, 42);
doc.text(`State : ${company.state || "-"}`, 14, 49);
  doc.text(`Invoice No : ${invoice.invoice_no}`, 124, 30);
  doc.text(`Date : ${formatDate(invoice.invoice_date)}`, 124, 38);

  // ===== Buyer =====

  doc.rect(10, 60, 110, 45);
  doc.rect(120, 60, 80, 45);

  doc.setFont("helvetica", "bold");
  doc.text("Buyer (Bill To)", 14, 68);

  doc.setFont("helvetica", "normal");
  doc.text(invoice.customer_name || "-", 14, 76);
  doc.text(invoice.customer_address || "-", 14, 84);
  doc.text(`GSTIN : ${invoice.customer_gst || "-"}`, 14, 92);

  doc.setFont("helvetica", "bold");
  doc.text("Terms / Delivery", 124, 68);

  doc.setFont("helvetica", "normal");
  doc.text("-", 124, 76);

  // ===== Items =====

  autoTable(doc, {
    startY: 105,

    theme: "grid",

    head: [[
      "Sl",
      "Description",
      "Qty",
      "Rate",
      "GST %",
      "Amount"
    ]],

    body: items.map((item, index) => [

      index + 1,

      item.item_name,

      item.quantity,

      item.rate,

      item.gst_percentage + "%",

      item.amount,

    ]),

    styles: {
      fontSize: 10,
      cellPadding: 3,
      lineWidth: 0.2,
      lineColor: [0,0,0]
    },

    headStyles: {
      fillColor: [240,240,240],
      textColor: [0,0,0],
      fontStyle: "bold"
    }

  });

  const finalY = (doc as any).lastAutoTable.finalY + 8;

  // ===== Totals =====

  doc.rect(120, finalY, 80, 42);

  doc.setFont("helvetica", "normal");

  doc.text(`Subtotal : ${CURRENCY} ${invoice.subtotal}`, 124, finalY + 8);

  doc.text(`CGST : ${CURRENCY} ${invoice.cgst}`, 124, finalY + 16);

  doc.text(`SGST : ${CURRENCY} ${invoice.sgst}`, 124, finalY + 24);

  doc.text(`IGST : ${CURRENCY} ${invoice.igst}`, 124, finalY + 32);

  doc.setFont("helvetica", "bold");

  doc.text(
    `Grand Total : ${CURRENCY} ${invoice.grand_total}`,
    124,
    finalY + 40
  );

  // ===== Declaration =====

  doc.rect(10, finalY, 110, 42);

  doc.setFont("helvetica", "bold");
  doc.text("Declaration", 14, finalY + 8);

  doc.setFont("helvetica", "normal");

  doc.text(
    "We declare that this invoice shows the",
    14,
    finalY + 16
  );

  doc.text(
    "actual price of the goods described.",
    14,
    finalY + 22
  );

  // ===== Signature =====

  doc.text(
    `For ${company.company_name || "-"}`,
    135,
    finalY + 55
  );

  doc.text(
    "Authorised Signatory",
    138,
    finalY + 72
  );

  doc.save(`${invoice.invoice_no}.pdf`);

};

// ---------------------------------------------------------------------
// If you want the real ₹ glyph instead of "Rs.", embed a Unicode font
// that includes it (e.g. Noto Sans) and use it instead of helvetica:
//
//   import { NotoSansRegular } from "./fonts/NotoSans-Regular"; // base64 TTF
//
//   doc.addFileToVFS("NotoSans-Regular.ttf", NotoSansRegular);
//   doc.addFont("NotoSans-Regular.ttf", "NotoSans", "normal");
//   doc.setFont("NotoSans", "normal");
//
// Then use "\u20B9" (the ₹ character) instead of CURRENCY in the text
// calls above. Standard fonts (helvetica/times/courier) will always
// corrupt ₹, so this only works with an embedded font.
// ---------------------------------------------------------------------