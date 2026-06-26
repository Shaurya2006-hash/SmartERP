const pool = require("../config/db");

// Create Ledger
const createLedger = async (req, res) => {
  try {
    const {
      company_id,
      ledger_name,
      ledger_type,
      address,
      phone,
      email,
      gst_number,
      opening_balance,
      balance_type,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO ledgers
      (
        company_id,
        ledger_name,
        ledger_type,
        address,
        phone,
        email,
        gst_number,
        opening_balance,
        balance_type
      )
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        company_id,
        ledger_name,
        ledger_type,
        address,
        phone,
        email,
        gst_number,
        opening_balance,
        balance_type,
      ]
    );

    res.json({
      success: true,
      ledger: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Ledgers
const getLedgers = async (req, res) => {
  try {
    const { companyId } = req.params;

    const result = await pool.query(
      "SELECT * FROM ledgers WHERE company_id=$1 ORDER BY id DESC",
      [companyId]
    );

    res.json({
      success: true,
      ledgers: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Ledger
const updateLedger = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      ledger_name,
      ledger_type,
      address,
      phone,
      email,
      gst_number,
      opening_balance,
      balance_type,
    } = req.body;

    const result = await pool.query(
      `UPDATE ledgers
       SET
       ledger_name=$1,
       ledger_type=$2,
       address=$3,
       phone=$4,
       email=$5,
       gst_number=$6,
       opening_balance=$7,
       balance_type=$8
       WHERE id=$9
       RETURNING *`,
      [
        ledger_name,
        ledger_type,
        address,
        phone,
        email,
        gst_number,
        opening_balance,
        balance_type,
        id,
      ]
    );

    res.json({
      success: true,
      ledger: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Ledger
const deleteLedger = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM ledgers WHERE id=$1",
      [id]
    );

    res.json({
      success: true,
      message: "Ledger Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search Ledger
const searchLedger = async (req, res) => {
  try {
    const { name } = req.query;

    const result = await pool.query(
      "SELECT * FROM ledgers WHERE ledger_name ILIKE $1",
      [`%${name}%`]
    );

    res.json({
      success: true,
      ledgers: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createLedger,
  getLedgers,
  updateLedger,
  deleteLedger,
  searchLedger,
};