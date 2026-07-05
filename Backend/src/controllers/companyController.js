const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const createCompany = async (req, res) => {
  try {

    const token = req.headers.authorization?.split(" ")[1];

    const decoded = jwt.verify(token, "smarterp_secret");

    const userId = decoded.id;

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
        user_id,
        company_name,
        address,
        gst_number,
        financial_year,
        state
      )
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        userId,
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
      success:false,
      message:error.message
    });

  }
};

const getCompanies = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const decoded = jwt.verify(token, "smarterp_secret");

    const companies = await pool.query(
      "SELECT * FROM companies WHERE user_id=$1 ORDER BY id DESC",
      [decoded.id]
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
    const token = req.headers.authorization?.split(" ")[1];

    const decoded = jwt.verify(token, "smarterp_secret");

    const { id } = req.params;

    const company = await pool.query(
      "SELECT * FROM companies WHERE id=$1 AND user_id=$2",
      [id, decoded.id]
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
    const token = req.headers.authorization?.split(" ")[1];

    const decoded = jwt.verify(token, "smarterp_secret");

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
       WHERE id=$6 AND user_id=$7
       RETURNING *`,
      [
        company_name,
        address,
        gst_number,
        financial_year,
        state,
        id,
        decoded.id,
      ]
    );

    if (company.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Company not found or not yours",
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

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
};