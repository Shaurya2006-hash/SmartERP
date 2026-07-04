const express = require("express");
const router = express.Router();

const {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
 

} = require("../controllers/companyController");

router.post("/create", createCompany);
router.get("/all", getCompanies);
router.get("/:id", getCompanyById);
router.put("/update/:id", updateCompany);

module.exports = router;
