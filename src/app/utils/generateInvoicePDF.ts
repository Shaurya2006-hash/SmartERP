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

  doc.setFontSize(20);
  doc.text("GST INVOICE", 80, 15);

  doc.setFontSize(12);

  doc.text("Company Name", 14, 30);
  doc.text("Company Address", 14, 37);
  doc.text("GSTIN : XXXXX1234X", 14, 44);

  doc.text(`Invoice No : ${invoice.invoice_no}`, 140, 30);
  doc.text(`Date : ${invoice.invoice_date}`, 140, 37);

  doc.text(`Customer : ${invoice.customer_name}`, 14, 60);
  doc.text(`Address : ${invoice.customer_address}`, 14, 67);
  doc.text(`GST : ${invoice.customer_gst}`, 14, 74);

  autoTable(doc, {
    startY: 85,
    head: [
      [
        "Item",
        "Qty",
        "Rate",
        "GST %",
        "Amount"
      ]
    ],
    body: items.map(item => [
      item.item_name,
      item.quantity,
      item.rate,
      item.gst_percentage,
      item.amount
    ])
  });

  const finalY =
    (doc as any).lastAutoTable.finalY + 10;

  doc.text(
    `Subtotal : ₹ ${invoice.subtotal}`,
    140,
    finalY
  );

  doc.text(
    `CGST : ₹ ${invoice.cgst}`,
    140,
    finalY + 8
  );

  doc.text(
    `SGST : ₹ ${invoice.sgst}`,
    140,
    finalY + 16
  );

  doc.text(
    `IGST : ₹ ${invoice.igst}`,
    140,
    finalY + 24
  );

  doc.setFontSize(14);

  doc.text(
    `Grand Total : ₹ ${invoice.grand_total}`,
    140,
    finalY + 36
  );

  doc.save(`${invoice.invoice_no}.pdf`);

};