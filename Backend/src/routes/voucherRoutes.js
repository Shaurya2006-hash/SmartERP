const express = require("express");
const router = express.Router();
const {
  createVoucher,
  createPurchaseVoucher,
  createSalesVoucher,

  getVouchers,
  getVoucherById,
  getSalesVouchers,
  getSalesVoucherById,

  updateVoucher,
  updateSalesVoucher,



  searchVoucher,
} = require("../controllers/voucherController");
// Create Voucher
router.post("/create", createVoucher);

// Get All Vouchers
router.get("/all/:companyId", getVouchers);

// Search Voucher
router.get("/search", searchVoucher);

// Get Voucher By Id
router.get("/:id", getVoucherById);

// Update Voucher
router.put("/update/:id", updateVoucher);

// Delete Voucher

router.post("/purchase/create", createPurchaseVoucher);
router.post("/sales/create", createSalesVoucher);
router.get(
  "/sales/all/:companyId",
  getSalesVouchers
);

router.get(
  "/sales/:id",
  getSalesVoucherById
);
router.put(
  "/sales/update/:id",
  updateSalesVoucher
);

module.exports = router;