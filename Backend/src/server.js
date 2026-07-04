const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const pool = require("./config/db");

const app = express();

const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const ledgerRoutes = require("./routes/ledgerRoutes");
const groupRoutes = require("./routes/groupRoutes");
const unitRoutes = require("./routes/unitRoutes");
const stockGroupRoute = require("./routes/stockGroupRoute");
const stockItemRoutes = require("./routes/stockItemRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const voucherRoutes = require("./routes/voucherRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

// CORS
app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/unit", unitRoutes);
app.use("/api/stock-group", stockGroupRoute);
app.use("/api/stock-item", stockItemRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/voucher", voucherRoutes);
app.use("/api/invoice", invoiceRoutes);

app.get("/", (req, res) => {
  res.send("SmartERP Backend Running");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Render-compatible PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});