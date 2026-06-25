const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  createCompany,
  getCompanies,
} = require("../controllers/companyController");

router.post(
  "/create",
  authMiddleware,
  createCompany
);

router.get(
  "/all",
  authMiddleware,
  getCompanies
);

module.exports = router;