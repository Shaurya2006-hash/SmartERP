const pool = require("../config/db");

const createCompany = async (req, res) => {
  try {
    const {
      company_name,
      address,
      gst_number,
      financial_year,
      state,
    } = req.body;

    const company = await pool.query(
      `INSERT INTO companies
      (
        company_name,
        address,
        gst_number,
        financial_year,
        state
      )
      VALUES($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        company_name,
        address,
        gst_number,
        financial_year,
        state,
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
      "SELECT * FROM companies ORDER BY id DESC"
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

const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await pool.query(
      "SELECT * FROM companies WHERE id=$1",
      [id]
    );

    if (company.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

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

const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      company_name,
      address,
      gst_number,
      financial_year,
      state,
    } = req.body;

    const company = await pool.query(
      `UPDATE companies
       SET company_name=$1,
           address=$2,
           gst_number=$3,
           financial_year=$4,
           state=$5
       WHERE id=$6
       RETURNING *`,
      [
        company_name,
        address,
        gst_number,
        financial_year,
        state,
        id,
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

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
};
