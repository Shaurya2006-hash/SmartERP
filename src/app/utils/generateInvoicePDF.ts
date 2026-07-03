import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

export const generateInvoicePDF = (
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
  doc.text("Your Company Name", 14, 28);
  doc.setFontSize(10);
  doc.text("Company Address", 14, 35);
  doc.text("GSTIN : XXXXX1234X", 14, 42);
  doc.text("State : Maharashtra", 14, 49);

  doc.text(`Invoice No : ${invoice.invoice_no}`, 124, 30);
  doc.text(`Date : ${invoice.invoice_date}`, 124, 38);

  // ===== Buyer =====

  doc.rect(10, 60, 110, 45);
  doc.rect(120, 60, 80, 45);

  doc.setFont("helvetica", "bold");
  doc.text("Buyer (Bill To)", 14, 68);

  doc.setFont("helvetica", "normal");
  doc.text(invoice.customer_name, 14, 76);
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

  doc.text(`Subtotal : ₹ ${invoice.subtotal}`, 124, finalY + 8);

  doc.text(`CGST : ₹ ${invoice.cgst}`, 124, finalY + 16);

  doc.text(`SGST : ₹ ${invoice.sgst}`, 124, finalY + 24);

  doc.text(`IGST : ₹ ${invoice.igst}`, 124, finalY + 32);

  doc.setFont("helvetica", "bold");

  doc.text(
    `Grand Total : ₹ ${invoice.grand_total}`,
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
    "For Your Company Name",
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