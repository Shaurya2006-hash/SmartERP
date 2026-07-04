const express = require("express");
const router = express.Router();

const {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,

} = require("../controllers/companyController");

router.post("/create", createCompany);
router.get("/all", getCompanies);
router.get("/:id", getCompanyById);
router.put("/update/:id", updateCompany);

router.delete("/delete/:id", deleteCompany);
module.exports = router;
