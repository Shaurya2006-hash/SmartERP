const pool = require("../config/db");

// Create Unit
const createUnit = async (req, res) => {
  try {
    const { company_id, unit_name, unit_symbol } = req.body;

    const result = await pool.query(
      `INSERT INTO units
      (company_id, unit_name, unit_symbol)
      VALUES($1,$2,$3)
      RETURNING *`,
      [company_id, unit_name, unit_symbol]
    );

    res.json({
      success: true,
      unit: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Units
const getUnits = async (req, res) => {
  try {
    const { companyId } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM units
       WHERE company_id=$1
       ORDER BY id DESC`,
      [companyId]
    );

    res.json({
      success: true,
      units: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Unit
const getUnitById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM units WHERE id=$1",
      [id]
    );

    res.json({
      success: true,
      unit: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Unit
const updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { unit_name, unit_symbol } = req.body;

    const result = await pool.query(
      `UPDATE units
       SET
       unit_name=$1,
       unit_symbol=$2
       WHERE id=$3
       RETURNING *`,
      [
        unit_name,
        unit_symbol,
        id,
      ]
    );

    res.json({
      success: true,
      unit: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Unit
const deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM units WHERE id=$1",
      [id]
    );

    res.json({
      success: true,
      message: "Unit Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search Unit
const searchUnit = async (req, res) => {
  try {
    const { name } = req.query;

    const result = await pool.query(
      `SELECT *
       FROM units
       WHERE unit_name ILIKE $1`,
      [`%${name}%`]
    );

    res.json({
      success: true,
      units: result.rows,
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
  createUnit,
  getUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
  searchUnit,
};