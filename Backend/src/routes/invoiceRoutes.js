const express=require("express");
const router=express.Router();

const{
createInvoice,
getAllInvoices,
getInvoiceById,
updateInvoice,
deleteInvoice,
searchInvoice
}=require("../controllers/invoiceController");

router.post("/create",createInvoice);

router.get("/all/:companyId",getAllInvoices);

router.get("/search",searchInvoice);

router.get("/:id",getInvoiceById);

router.put("/update/:id",updateInvoice);

router.delete("/delete/:id",deleteInvoice);

module.exports=router;