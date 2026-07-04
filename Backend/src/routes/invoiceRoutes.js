const express=require("express");
const router=express.Router();

const{
createInvoice,
getAllInvoices,
getInvoiceById,
updateInvoice,

searchInvoice
}=require("../controllers/invoiceController");

router.post("/create",createInvoice);

router.get("/all/:companyId",getAllInvoices);

router.get("/search",searchInvoice);

router.get("/:id",getInvoiceById);

router.put("/update/:id",updateInvoice);



module.exports=router;