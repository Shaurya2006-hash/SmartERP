const express = require("express");
const router = express.Router();

const {
  createLedger,
  getLedgers,
  getLedgerById,
  updateLedger,
  searchLedger,
} = require("../controllers/ledgerController");

router.post("/create", createLedger);

router.get("/all/:companyId", getLedgers);

router.put("/update/:id", updateLedger);


router.get("/search", searchLedger);
router.get("/:id", getLedgerById);

module.exports = router;