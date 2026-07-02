const pool=require("../config/db");

// Generate Invoice Number
const generateInvoiceNumber=async(companyId,documentType)=>{

let result=await pool.query(
"SELECT * FROM invoice_settings WHERE company_id=$1",
[companyId]
);

if(result.rows.length===0){

await pool.query(
`INSERT INTO invoice_settings
(company_id,invoice_prefix,financial_year,current_number)
VALUES($1,$2,$3,$4)`,
[companyId,"INV","2025-26",1]
);

result=await pool.query(
"SELECT * FROM invoice_settings WHERE company_id=$1",
[companyId]
);

}

const setting=result.rows[0];

let prefix="INV";

if(documentType==="Quotation") prefix="QT";
if(documentType==="Estimate") prefix="EST";
if(documentType==="Proforma Invoice") prefix="PI";
if(documentType==="Purchase Invoice") prefix="PINV";
if(documentType==="GST Invoice") prefix="INV";

const invoiceNo=
`${prefix}-${setting.financial_year}-${String(setting.current_number).padStart(4,"0")}`;

await pool.query(
"UPDATE invoice_settings SET current_number=current_number+1 WHERE company_id=$1",
[companyId]
);

return invoiceNo;

};

// Create Invoice
const createInvoice=async(req,res)=>{

try{

const{
company_id,
document_type,
invoice_date,
customer_name,
customer_address,
customer_gst,
reference_no,
narration,
subtotal,
cgst,
sgst,
igst,
grand_total,
status,
items
}=req.body;

if(!items||items.length===0){
return res.status(400).json({
success:false,
message:"At least one item is required."
});
}

const invoiceNumber=await generateInvoiceNumber(company_id,document_type);

const invoiceResult=await pool.query(

`INSERT INTO invoices
(
company_id,
invoice_no,
document_type,
invoice_date,
customer_name,
customer_address,
customer_gst,
reference_no,
narration,
subtotal,
cgst,
sgst,
igst,
grand_total,
status
)
VALUES
($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
RETURNING *;`,

[
company_id,
invoiceNumber,
document_type,
invoice_date,
customer_name,
customer_address,
customer_gst,
reference_no,
narration,
subtotal,
cgst,
sgst,
igst,
grand_total,
status||"Draft"
]
);

const invoiceId=invoiceResult.rows[0].id;

const isTaxableDoc=
document_type==="GST Invoice"||document_type==="Purchase Invoice";

if(isTaxableDoc){

await pool.query(

`INSERT INTO gst_records
(
company_id,
invoice_id,
taxable_amount,
cgst,
sgst,
igst,
total_gst
)
VALUES($1,$2,$3,$4,$5,$6,$7)`,

[
company_id,
invoiceId,
subtotal,
cgst,
sgst,
igst,
Number(cgst)+Number(sgst)+Number(igst)
]

);

}

// NOTE: still no insert into `transactions`. That table is a
// double-entry ledger (ledger_id / debit / credit) with no
// invoice_id or company_id column, so it can't be linked to an
// invoice without a real ledger design (chart of accounts, which
// ledger to debit/credit, etc). Say the word if you want to design
// that properly — it's a separate piece of work from this fix.

for(const item of items){

await pool.query(

`INSERT INTO invoice_items
(
invoice_id,
stock_item_id,
quantity,
rate,
gst_percentage,
amount
)
VALUES($1,$2,$3,$4,$5,$6)`,

[
invoiceId,
item.stock_item_id,
item.quantity,
item.rate,
item.gst_percentage,
item.amount
]

);

if(isTaxableDoc){

const stockChange=
document_type==="Purchase Invoice" ? item.quantity : -item.quantity;

await pool.query(

`UPDATE stock_items
SET quantity=quantity+$1
WHERE id=$2`,

[
stockChange,
item.stock_item_id
]

);

await pool.query(

`INSERT INTO inventory_transactions
(
company_id,
invoice_id,
stock_item_id,
transaction_type,
quantity,
rate,
transaction_date
)
VALUES($1,$2,$3,$4,$5,$6,$7)`,

[
company_id,
invoiceId,
item.stock_item_id,
document_type==="Purchase Invoice" ? "Purchase" : "Sales",
item.quantity,
item.rate,
invoice_date
]

);

}

}

res.json({
success:true,
message:`${document_type||"Invoice"} Created Successfully`,
invoice:invoiceResult.rows[0]
});

}catch(error){

console.error(error);

res.status(500).json({
success:false,
message:error.message
});

}

};

// Get All Invoices (optionally filter by document_type)
const getAllInvoices=async(req,res)=>{

try{

const{companyId}=req.params;
const{documentType}=req.query;

let query=`SELECT * FROM invoices WHERE company_id=$1`;
const params=[companyId];

if(documentType){
query+=` AND document_type=$2`;
params.push(documentType);
}

query+=` ORDER BY id DESC`;

const result=await pool.query(query,params);

res.json({
success:true,
invoices:result.rows
});

}catch(error){

console.error(error);

res.status(500).json({
success:false,
message:error.message
});

}

};

// Get Invoice By Id
const getInvoiceById=async(req,res)=>{

try{

const{id}=req.params;

const invoiceResult=await pool.query(
"SELECT * FROM invoices WHERE id=$1",
[id]
);

const itemResult=await pool.query(
`SELECT
invoice_items.*,
stock_items.item_name
FROM invoice_items
LEFT JOIN stock_items
ON invoice_items.stock_item_id=stock_items.id
WHERE invoice_id=$1`,
[id]
);

res.json({
success:true,
invoice:invoiceResult.rows[0],
items:itemResult.rows
});

}catch(error){

console.error(error);

res.status(500).json({
success:false,
message:error.message
});

}

};

// Update Invoice
const updateInvoice=async(req,res)=>{

try{

const{id}=req.params;

const{
document_type,
invoice_date,
customer_name,
customer_address,
customer_gst,
reference_no,
narration,
subtotal,
cgst,
sgst,
igst,
grand_total,
status,
items
}=req.body;

if(!items||items.length===0){
return res.status(400).json({
success:false,
message:"At least one item is required."
});
}

// Use the invoice's ORIGINAL document_type (from DB) to reverse
// whatever stock movement actually happened at create/last-update
// time, not the possibly-new document_type from this request.
const existingInvoice=await pool.query(
"SELECT document_type,company_id FROM invoices WHERE id=$1",
[id]
);

const oldDocumentType=existingInvoice.rows[0]?.document_type;
const wasTaxableDoc=
oldDocumentType==="GST Invoice"||oldDocumentType==="Purchase Invoice";

const isTaxableDoc=
document_type==="GST Invoice"||document_type==="Purchase Invoice";

const oldItems=await pool.query(
"SELECT * FROM invoice_items WHERE invoice_id=$1",
[id]
);

// Reverse old stock movements using the ORIGINAL document_type
if(wasTaxableDoc){

for(const item of oldItems.rows){

const revert=
oldDocumentType==="Purchase Invoice" ? -item.quantity : item.quantity;

await pool.query(
"UPDATE stock_items SET quantity=quantity+$1 WHERE id=$2",
[
revert,
item.stock_item_id
]
);

}

}

await pool.query(
"DELETE FROM invoice_items WHERE invoice_id=$1",
[id]
);

// Now that inventory_transactions has invoice_id, old rows for this
// invoice can be precisely cleared before reinserting.
await pool.query(
"DELETE FROM inventory_transactions WHERE invoice_id=$1",
[id]
);

const result=await pool.query(
`UPDATE invoices
SET
document_type=$1,
invoice_date=$2,
customer_name=$3,
customer_address=$4,
customer_gst=$5,
reference_no=$6,
narration=$7,
subtotal=$8,
cgst=$9,
sgst=$10,
igst=$11,
grand_total=$12,
status=$13
WHERE id=$14
RETURNING *`,
[
document_type,
invoice_date,
customer_name,
customer_address,
customer_gst,
reference_no,
narration,
subtotal,
cgst,
sgst,
igst,
grand_total,
status,
id
]
);

if(isTaxableDoc){

const existingGst=await pool.query(
"SELECT id FROM gst_records WHERE invoice_id=$1",
[id]
);

if(existingGst.rows.length>0){

await pool.query(
`UPDATE gst_records
SET
taxable_amount=$1,
cgst=$2,
sgst=$3,
igst=$4,
total_gst=$5
WHERE invoice_id=$6`,
[
subtotal,
cgst,
sgst,
igst,
Number(cgst)+Number(sgst)+Number(igst),
id
]
);

}else{

await pool.query(
`INSERT INTO gst_records
(company_id,invoice_id,taxable_amount,cgst,sgst,igst,total_gst)
SELECT company_id,$1,$2,$3,$4,$5,$6
FROM invoices WHERE id=$1`,
[
id,
subtotal,
cgst,
sgst,
igst,
Number(cgst)+Number(sgst)+Number(igst)
]
);

}

}else{

await pool.query(
"DELETE FROM gst_records WHERE invoice_id=$1",
[id]
);

}

for(const item of items){

await pool.query(
`INSERT INTO invoice_items
(
invoice_id,
stock_item_id,
quantity,
rate,
gst_percentage,
amount
)
VALUES($1,$2,$3,$4,$5,$6)`,
[
id,
item.stock_item_id,
item.quantity,
item.rate,
item.gst_percentage,
item.amount
]
);

if(isTaxableDoc){

const stockChange=
document_type==="Purchase Invoice" ? item.quantity : -item.quantity;

await pool.query(
"UPDATE stock_items SET quantity=quantity+$1 WHERE id=$2",
[
stockChange,
item.stock_item_id
]
);

await pool.query(
`INSERT INTO inventory_transactions
(
company_id,
invoice_id,
stock_item_id,
transaction_type,
quantity,
rate,
transaction_date
)
VALUES($1,$2,$3,$4,$5,$6,$7)`,
[
result.rows[0].company_id,
id,
item.stock_item_id,
document_type==="Purchase Invoice" ? "Purchase" : "Sales",
item.quantity,
item.rate,
invoice_date
]
);

}

}

res.json({
success:true,
message:"Updated Successfully",
invoice:result.rows[0]
});

}catch(error){

console.error(error);

res.status(500).json({
success:false,
message:error.message
});

}

};

// Delete Invoice
const deleteInvoice=async(req,res)=>{

try{

const{id}=req.params;

const invoiceRow=await pool.query(
"SELECT document_type FROM invoices WHERE id=$1",
[id]
);

const documentType=invoiceRow.rows[0]?.document_type;
const isTaxableDoc=
documentType==="GST Invoice"||documentType==="Purchase Invoice";

const items=await pool.query(
"SELECT * FROM invoice_items WHERE invoice_id=$1",
[id]
);

if(isTaxableDoc){

for(const item of items.rows){

const revert=
documentType==="Purchase Invoice" ? -item.quantity : item.quantity;

await pool.query(
"UPDATE stock_items SET quantity=quantity+$1 WHERE id=$2",
[
revert,
item.stock_item_id
]
);

}

}

await pool.query(
"DELETE FROM inventory_transactions WHERE invoice_id=$1",
[id]
);

await pool.query(
"DELETE FROM gst_records WHERE invoice_id=$1",
[id]
);

await pool.query(
"DELETE FROM invoice_items WHERE invoice_id=$1",
[id]
);

await pool.query(
"DELETE FROM invoices WHERE id=$1",
[id]
);

res.json({
success:true,
message:"Deleted Successfully"
});

}catch(error){

console.error(error);

res.status(500).json({
success:false,
message:error.message
});

}

};

// Search Invoice
const searchInvoice=async(req,res)=>{

try{

const{invoiceNo}=req.query;

const result=await pool.query(
`SELECT *
FROM invoices
WHERE
invoice_no ILIKE $1
OR document_type ILIKE $1
ORDER BY id DESC`,
[`%${invoiceNo}%`]
);

res.json({
success:true,
invoices:result.rows
});

}catch(error){

console.error(error);

res.status(500).json({
success:false,
message:error.message
});

}

};

module.exports={
createInvoice,
getAllInvoices,
getInvoiceById,
updateInvoice,
deleteInvoice,
searchInvoice
};