const pool = require("../config/db");

// ==========================================
// Create Voucher
// ==========================================

const createVoucher = async (req, res) => {
  try {
    const {
      company_id,
      voucher_no,
      voucher_type,
      voucher_date,
      reference_no,
      narration,
      total_amount,
      entries,
    } = req.body;

    // Create Voucher Header
    const voucherResult = await pool.query(
      `INSERT INTO vouchers
      (
        company_id,
        voucher_no,
        voucher_type,
        voucher_date,
        reference_no,
        narration,
        total_amount
      )
      VALUES($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        company_id,
        voucher_no,
        voucher_type,
        voucher_date,
        reference_no,
        narration,
        total_amount,
      ]
    );

    const voucherId = voucherResult.rows[0].id;

    // Save Voucher Entries
    for (const entry of entries) {
      await pool.query(
        `INSERT INTO voucher_entries
        (
          voucher_id,
          ledger_id,
          debit,
          credit
        )
        VALUES($1,$2,$3,$4)`,
        [
          voucherId,
          entry.ledger_id,
          entry.debit,
          entry.credit,
        ]
      );
    }

    res.json({
      success: true,
      message: "Voucher Created Successfully",
      voucher: voucherResult.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Get All Vouchers
// ==========================================

const getVouchers = async (req, res) => {

  try {

    const { companyId } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM vouchers
       WHERE company_id=$1
       ORDER BY voucher_date DESC,id DESC`,
      [companyId]
    );

    res.json({
      success: true,
      vouchers: result.rows,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ==========================================
// Get Voucher By Id
// ==========================================

const getVoucherById = async (req, res) => {

  try {

    const { id } = req.params;

    const voucher = await pool.query(
      "SELECT * FROM vouchers WHERE id=$1",
      [id]
    );

    const entries = await pool.query(
      `SELECT
          voucher_entries.*,
          ledgers.ledger_name
       FROM voucher_entries
       LEFT JOIN ledgers
       ON voucher_entries.ledger_id=ledgers.id
       WHERE voucher_id=$1`,
      [id]
    );

    res.json({
      success: true,
      voucher: voucher.rows[0],
      entries: entries.rows,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
// ==========================================
// Update Voucher
// ==========================================

const updateVoucher = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      voucher_no,
      voucher_type,
      voucher_date,
      reference_no,
      narration,
      total_amount,
      entries,
    } = req.body;

    // Update Voucher Header
    const result = await pool.query(
      `UPDATE vouchers
       SET
       voucher_no=$1,
       voucher_type=$2,
       voucher_date=$3,
       reference_no=$4,
       narration=$5,
       total_amount=$6
       WHERE id=$7
       RETURNING *`,
      [
        voucher_no,
        voucher_type,
        voucher_date,
        reference_no,
        narration,
        total_amount,
        id,
      ]
    );

    // Delete Old Entries
    await pool.query(
      "DELETE FROM voucher_entries WHERE voucher_id=$1",
      [id]
    );

    // Insert New Entries
    for (const entry of entries) {
      await pool.query(
        `INSERT INTO voucher_entries
        (
          voucher_id,
          ledger_id,
          debit,
          credit
        )
        VALUES($1,$2,$3,$4)`,
        [
          id,
          entry.ledger_id,
          entry.debit,
          entry.credit,
        ]
      );
    }

    res.json({
      success: true,
      message: "Voucher Updated Successfully",
      voucher: result.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ==========================================
// Delete Voucher
// ==========================================

const deleteVoucher = async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM vouchers WHERE id=$1",
      [id]
    );

    res.json({
      success: true,
      message: "Voucher Deleted Successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
// ==========================================
// Search Voucher
// ==========================================

const searchVoucher = async (req, res) => {

  try {

    const { type } = req.query;

    const result = await pool.query(
      `SELECT *
       FROM vouchers
       WHERE voucher_type ILIKE $1
       ORDER BY voucher_date DESC`,
      [`%${type}%`]
    );

    res.json({
      success: true,
      vouchers: result.rows,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
// ==========================================
// Create Purchase Voucher
// ==========================================

const createPurchaseVoucher = async (req, res) => {
  try {

    const {
      company_id,
      voucher_no,
      voucher_date,
      reference_no,
      narration,
      total_amount,
      entries,
      items,
    } = req.body;

    // Create Voucher Header
    const voucherResult = await pool.query(
      `INSERT INTO vouchers
      (
        company_id,
        voucher_no,
        voucher_type,
        voucher_date,
        reference_no,
        narration,
        total_amount
      )
      VALUES($1,$2,'Purchase',$3,$4,$5,$6)
      RETURNING *`,
      [
        company_id,
        voucher_no,
        voucher_date,
        reference_no,
        narration,
        total_amount,
      ]
    );

    const voucherId = voucherResult.rows[0].id;

    // Save Ledger Entries
    for (const entry of entries) {

      await pool.query(
        `INSERT INTO voucher_entries
        (
          voucher_id,
          ledger_id,
          debit,
          credit
        )
        VALUES($1,$2,$3,$4)`,
        [
          voucherId,
          entry.ledger_id,
          entry.debit,
          entry.credit,
        ]
      );

    }

    // Save Purchase Items
    for (const item of items) {

      await pool.query(
        `INSERT INTO purchase_items
        (
          voucher_id,
          stock_item_id,
          quantity,
          rate,
          gst_percentage,
          amount
        )
        VALUES($1,$2,$3,$4,$5,$6)`,
        [
          voucherId,
          item.stock_item_id,
          item.quantity,
          item.rate,
          item.gst_percentage,
          item.amount,
        ]
      );

      // Increase Stock
      await pool.query(
        `UPDATE stock_items
         SET quantity = quantity + $1
         WHERE id = $2`,
        [
          item.quantity,
          item.stock_item_id,
        ]
      );

    }

    res.json({
      success: true,
      message: "Purchase Voucher Saved Successfully",
      voucher: voucherResult.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const createSalesVoucher = async (req, res) => {
  try {

    const {
      company_id,
      voucher_no,
      voucher_date,
      reference_no,
      narration,
      total_amount,
      entries,
      items,
    } = req.body;

    const voucherResult = await pool.query(
      `INSERT INTO vouchers
      (
        company_id,
        voucher_no,
        voucher_type,
        voucher_date,
        reference_no,
        narration,
        total_amount
      )
      VALUES($1,$2,'Sales',$3,$4,$5,$6)
      RETURNING *`,
      [
        company_id,
        voucher_no,
        voucher_date,
        reference_no,
        narration,
        total_amount,
      ]
    );

    const voucherId = voucherResult.rows[0].id;

    // Save Ledger Entries
    for (const entry of entries) {

      await pool.query(
        `INSERT INTO voucher_entries
        (
          voucher_id,
          ledger_id,
          debit,
          credit
        )
        VALUES($1,$2,$3,$4)`,
        [
          voucherId,
          entry.ledger_id,
          entry.debit,
          entry.credit,
        ]
      );

    }

    // Save Sales Items
    for (const item of items) {

      await pool.query(
        `INSERT INTO sales_items
        (
          voucher_id,
          stock_item_id,
          quantity,
          rate,
          gst_percentage,
          amount
        )
        VALUES($1,$2,$3,$4,$5,$6)`,
        [
          voucherId,
          item.stock_item_id,
          item.quantity,
          item.rate,
          item.gst_percentage,
          item.amount,
        ]
      );

      // Reduce Stock
      await pool.query(
        `UPDATE stock_items
         SET quantity = quantity - $1
         WHERE id = $2`,
        [
          item.quantity,
          item.stock_item_id,
        ]
      );

    }

    res.json({
      success: true,
      message: "Sales Voucher Saved Successfully",
      voucher: voucherResult.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const getSalesVouchers = async (req, res) => {
  try {

    const { companyId } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM vouchers
       WHERE company_id=$1
       AND voucher_type='Sales'
       ORDER BY voucher_date DESC,id DESC`,
      [companyId]
    );

    res.json({
      success: true,
      vouchers: result.rows,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const getSalesVoucherById = async (req, res) => {

  try {

    const { id } = req.params;

    const voucher = await pool.query(
      `SELECT *
       FROM vouchers
       WHERE id=$1
       AND voucher_type='Sales'`,
      [id]
    );

    const entries = await pool.query(
      `SELECT
          voucher_entries.*,
          ledgers.ledger_name
       FROM voucher_entries
       LEFT JOIN ledgers
       ON voucher_entries.ledger_id=ledgers.id
       WHERE voucher_id=$1`,
      [id]
    );

    const items = await pool.query(
      `SELECT
          sales_items.*,
          stock_items.item_name
       FROM sales_items
       LEFT JOIN stock_items
       ON sales_items.stock_item_id=stock_items.id
       WHERE voucher_id=$1`,
      [id]
    );

    res.json({
      success: true,
      voucher: voucher.rows[0],
      entries: entries.rows,
      items: items.rows,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
const updateSalesVoucher = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      voucher_no,
      voucher_date,
      reference_no,
      narration,
      total_amount,
      entries,
      items,
    } = req.body;

    await pool.query("BEGIN");

    // Restore Previous Stock
    const oldItems = await pool.query(
      `SELECT *
       FROM sales_items
       WHERE voucher_id=$1`,
      [id]
    );

    for (const item of oldItems.rows) {

      await pool.query(
        `UPDATE stock_items
         SET quantity = quantity + $1
         WHERE id=$2`,
        [
          item.quantity,
          item.stock_item_id,
        ]
      );

    }

    // Update Voucher Header
    const result = await pool.query(
      `UPDATE vouchers
       SET
       voucher_no=$1,
       voucher_date=$2,
       reference_no=$3,
       narration=$4,
       total_amount=$5
       WHERE id=$6
       RETURNING *`,
      [
        voucher_no,
        voucher_date,
        reference_no,
        narration,
        total_amount,
        id,
      ]
    );

    // Delete Old Ledger Entries
    await pool.query(
      `DELETE FROM voucher_entries
       WHERE voucher_id=$1`,
      [id]
    );

    // Insert New Ledger Entries
    for (const entry of entries) {

      await pool.query(
        `INSERT INTO voucher_entries
        (
          voucher_id,
          ledger_id,
          debit,
          credit
        )
        VALUES($1,$2,$3,$4)`,
        [
          id,
          entry.ledger_id,
          entry.debit,
          entry.credit,
        ]
      );

    }

    // Delete Old Sales Items
    await pool.query(
      `DELETE FROM sales_items
       WHERE voucher_id=$1`,
      [id]
    );

    // Insert New Sales Items
    for (const item of items) {

      await pool.query(
        `INSERT INTO sales_items
        (
          voucher_id,
          stock_item_id,
          quantity,
          rate,
          gst_percentage,
          amount
        )
        VALUES($1,$2,$3,$4,$5,$6)`,
        [
          id,
          item.stock_item_id,
          item.quantity,
          item.rate,
          item.gst_percentage,
          item.amount,
        ]
      );

      // Reduce Stock Again
      await pool.query(
        `UPDATE stock_items
         SET quantity = quantity - $1
         WHERE id=$2`,
        [
          item.quantity,
          item.stock_item_id,
        ]
      );

    }

    await pool.query("COMMIT");

    res.json({
      success: true,
      message: "Sales Voucher Updated Successfully",
      voucher: result.rows[0],
    });

  } catch (error) {

    await pool.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
const deleteSalesVoucher = async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query("BEGIN");

    // Get Sales Items
    const items = await pool.query(
      `SELECT *
       FROM sales_items
       WHERE voucher_id=$1`,
      [id]
    );

    // Restore Stock
    for (const item of items.rows) {

      await pool.query(
        `UPDATE stock_items
         SET quantity = quantity + $1
         WHERE id=$2`,
        [
          item.quantity,
          item.stock_item_id,
        ]
      );

    }

    // Delete Sales Items
    await pool.query(
      `DELETE FROM sales_items
       WHERE voucher_id=$1`,
      [id]
    );

    // Delete Voucher Entries
    await pool.query(
      `DELETE FROM voucher_entries
       WHERE voucher_id=$1`,
      [id]
    );

    // Delete Voucher
    await pool.query(
      `DELETE FROM vouchers
       WHERE id=$1`,
      [id]
    );

    await pool.query("COMMIT");

    res.json({
      success: true,
      message: "Sales Voucher Deleted Successfully",
    });

  } catch (error) {

    await pool.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
module.exports = {
  createVoucher,
  createPurchaseVoucher,
  createSalesVoucher,

  getVouchers,
  getVoucherById,
  getSalesVouchers,
  getSalesVoucherById,

  updateVoucher,
  updateSalesVoucher,

  deleteVoucher,
  deleteSalesVoucher,

  searchVoucher,
};