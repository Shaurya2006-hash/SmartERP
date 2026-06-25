const pool = require("../config/db");

const createCompany = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      company_name,
      address,
      gst_number,
      financial_year,
      state,
      contact_number,
    } = req.body;

    const companyCount = await pool.query(
      "SELECT * FROM companies WHERE user_id=$1",
      [userId]
    );

    if (companyCount.rows.length >= 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 companies allowed",
      });
    }

    const company = await pool.query(
      `
      INSERT INTO companies
      (
        user_id,
        company_name,
        address,
        gst_number,
        financial_year,
        state,
        contact_number
      )
      VALUES($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        userId,
        company_name,
        address,
        gst_number,
        financial_year,
        state,
        contact_number,
      ]
    );

    res.json({
      success: true,
      company: company.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await pool.query(
      "SELECT * FROM companies WHERE user_id=$1",
      [req.user.id]
    );

    res.json({
      success: true,
      companies: companies.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCompany,
  getCompanies,
};