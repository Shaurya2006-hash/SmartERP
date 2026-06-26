const express = require("express");
const router = express.Router();

const {
  createLedger,
  getLedgers,
  updateLedger,
  deleteLedger,
  searchLedger,
} = require("../controllers/ledgerController");

router.post("/create", createLedger);

router.get("/all/:companyId", getLedgers);

router.put("/update/:id", updateLedger);

router.delete("/delete/:id", deleteLedger);

router.get("/search", searchLedger);

module.exports = router;