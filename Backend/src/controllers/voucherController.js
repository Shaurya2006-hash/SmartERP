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
module.exports = {
  createVoucher,
  createPurchaseVoucher,
  getVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  searchVoucher,
};