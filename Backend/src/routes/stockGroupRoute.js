const express = require("express");

const router = express.Router();

const {

  createStockGroup,
  getStockGroups,
  getStockGroupById,
  updateStockGroup,
  deleteStockGroup,
  searchStockGroup,

} = require("../controllers/stockGroupController");

router.post("/create",createStockGroup);

router.get("/all/:companyId",getStockGroups);

router.get("/search",searchStockGroup);

router.get("/:id",getStockGroupById);

router.put("/update/:id",updateStockGroup);

router.delete("/delete/:id",deleteStockGroup);

module.exports = router;