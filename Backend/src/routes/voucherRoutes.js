const express = require("express");
const router = express.Router();

const {
  createVoucher,
  createPurchaseVoucher,
  getVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
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
router.delete("/delete/:id", deleteVoucher);
router.post("/purchase/create", createPurchaseVoucher);

module.exports = router;