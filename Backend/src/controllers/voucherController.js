const pool = require("../config/db");

// ==========================================
// Helper: Generate Next Voucher Number
// ==========================================
// Looks at the highest existing voucher_no matching pattern P### and
// returns the next one. Called fresh on every voucher creation so the
// frontend never has to supply or guess a voucher_no.
const generateVoucherNo = async () => {
  const result = await pool.query(
    `SELECT voucher_no
     FROM vouchers
     WHERE voucher_no ~ '^P[0-9]+$'
     ORDER BY id DESC
     LIMIT 1`
  );

  if (result.rows.length === 0) return "P001";

  const lastNo = result.rows[0].voucher_no;
  const num = parseInt(lastNo.replace("P", ""), 10);

  return "P" + String(num + 1).padStart(3, "0");
};

// ==========================================
// Create Voucher
// ==========================================

const createVoucher = async (req, res) => {
  try {
    const {
      company_id,
      voucher_type,
      voucher_date,
      reference_no,
      narration,
      total_amount,
      entries,
    } = req.body;

    const voucher_no = await generateVoucherNo();

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

    for (const entry of entries) {
      await pool.query(
        `INSERT INTO voucher_entries
        (voucher_id, ledger_id, debit, credit)
        VALUES($1,$2,$3,$4)`,
        [voucherId, entry.ledger_id, entry.debit, entry.credit]
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
// NOTE: voucher_no is intentionally NOT updated here -
// once a voucher is created its number should stay fixed.

const updateVoucher = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      voucher_type,
      voucher_date,
      reference_no,
      narration,
      total_amount,
      entries,
    } = req.body;

    const result = await pool.query(
      `UPDATE vouchers
       SET
       voucher_type=$1,
       voucher_date=$2,
       reference_no=$3,
       narration=$4,
       total_amount=$5
       WHERE id=$6
       RETURNING *`,
      [
        voucher_type,
        voucher_date,
        reference_no,
        narration,
        total_amount,
        id,
      ]
    );

    await pool.query(
      "DELETE FROM voucher_entries WHERE voucher_id=$1",
      [id]
    );

    for (const entry of entries) {
      await pool.query(
        `INSERT INTO voucher_entries
        (voucher_id, ledger_id, debit, credit)
        VALUES($1,$2,$3,$4)`,
        [id, entry.ledger_id, entry.debit, entry.credit]
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
      voucher_date,
      reference_no,
      narration,
      total_amount,
      entries,
      items,
    } = req.body;

    const validItems = items.filter(
      item => item.stock_item_id && Number(item.quantity) > 0
    );

    if (validItems.length === 0) {
      return res.json({
        success: false,
        message: "Please select at least one stock item."
      });
    }

    const voucher_no = await generateVoucherNo();

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

    for (const entry of entries) {
      await pool.query(
        `INSERT INTO voucher_entries
        (voucher_id, ledger_id, debit, credit)
        VALUES($1,$2,$3,$4)`,
        [voucherId, entry.ledger_id, entry.debit, entry.credit]
      );
    }

    for (const item of validItems) {
      await pool.query(
        `INSERT INTO purchase_items
        (voucher_id, stock_item_id, quantity, rate, gst_percentage, amount)
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

      await pool.query(
        `UPDATE stock_items
         SET quantity = quantity + $1
         WHERE id = $2`,
        [item.quantity, item.stock_item_id]
      );
    }

    res.json({
      success: true,
      message: "Purchase Voucher Saved Successfully",
      voucher: voucherResult.rows[0],
    });

  } catch (error) {

    console.error(error);

    if (error.code === "23505" && error.constraint === "vouchers_voucher_no_key") {
      return res.status(400).json({
        success: false,
        message: "Voucher number collision, please try saving again.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Create Sales Voucher
// ==========================================

const createSalesVoucher = async (req, res) => {
  try {

    const {
      company_id,
      voucher_date,
      reference_no,
      narration,
      total_amount,
      entries,
      items,
    } = req.body;

    const validItems = items.filter(
      item => item.stock_item_id && Number(item.quantity) > 0
    );

    if (validItems.length === 0) {
      return res.json({
        success: false,
        message: "Please select at least one stock item."
      });
    }

    const voucher_no = await generateVoucherNo();

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

    for (const entry of entries) {
      await pool.query(
        `INSERT INTO voucher_entries
        (voucher_id, ledger_id, debit, credit)
        VALUES($1,$2,$3,$4)`,
        [voucherId, entry.ledger_id, entry.debit, entry.credit]
      );
    }

    for (const item of validItems) {
      await pool.query(
        `INSERT INTO sales_items
        (voucher_id, stock_item_id, quantity, rate, gst_percentage, amount)
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

      await pool.query(
        `UPDATE stock_items
         SET quantity = quantity - $1
         WHERE id = $2`,
        [item.quantity, item.stock_item_id]
      );
    }

    res.json({
      success: true,
      message: "Sales Voucher Saved Successfully",
      voucher: voucherResult.rows[0],
    });

  } catch (error) {

    console.error(error);

    if (error.code === "23505" && error.constraint === "vouchers_voucher_no_key") {
      return res.status(400).json({
        success: false,
        message: "Voucher number collision, please try saving again.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Get Sales Vouchers
// ==========================================

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

// ==========================================
// Get Sales Voucher By Id
// ==========================================

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

// ==========================================
// Update Sales Voucher
// ==========================================
// NOTE: voucher_no is intentionally NOT updated here -
// once a voucher is created its number should stay fixed.

const updateSalesVoucher = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      voucher_date,
      reference_no,
      narration,
      total_amount,
      entries,
      items,
    } = req.body;

    const validItems = items.filter(
      item => item.stock_item_id && Number(item.quantity) > 0
    );

    if (validItems.length === 0) {
      return res.json({
        success: false,
        message: "Please select at least one stock item."
      });
    }

    await pool.query("BEGIN");

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
        [item.quantity, item.stock_item_id]
      );
    }

    const result = await pool.query(
      `UPDATE vouchers
       SET
       voucher_date=$1,
       reference_no=$2,
       narration=$3,
       total_amount=$4
       WHERE id=$5
       RETURNING *`,
      [
        voucher_date,
        reference_no,
        narration,
        total_amount,
        id,
      ]
    );

    await pool.query(
      `DELETE FROM voucher_entries
       WHERE voucher_id=$1`,
      [id]
    );

    for (const entry of entries) {
      await pool.query(
        `INSERT INTO voucher_entries
        (voucher_id, ledger_id, debit, credit)
        VALUES($1,$2,$3,$4)`,
        [id, entry.ledger_id, entry.debit, entry.credit]
      );
    }

    await pool.query(
      `DELETE FROM sales_items
       WHERE voucher_id=$1`,
      [id]
    );

    for (const item of validItems) {
      await pool.query(
        `INSERT INTO sales_items
        (voucher_id, stock_item_id, quantity, rate, gst_percentage, amount)
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

      await pool.query(
        `UPDATE stock_items
         SET quantity = quantity - $1
         WHERE id=$2`,
        [item.quantity, item.stock_item_id]
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


  searchVoucher,
};