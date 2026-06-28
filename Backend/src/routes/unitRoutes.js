const express = require("express");

const router = express.Router();

const {
  createUnit,
  getUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
  searchUnit,
} = require("../controllers/unitController");

router.post("/create", createUnit);

router.get("/all/:companyId", getUnits);

router.get("/search", searchUnit);

router.get("/:id", getUnitById);

router.put("/update/:id", updateUnit);

router.delete("/delete/:id", deleteUnit);

module.exports = router;