const express = require("express");

const router = express.Router();

const {
    getDashboard
} = require("../controllers/dashboardController");

router.get("/:companyId", getDashboard);

module.exports = router;