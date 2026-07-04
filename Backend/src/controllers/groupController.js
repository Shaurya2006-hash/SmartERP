const pool = require("../config/db");

// Create Group
const createGroup = async (req, res) => {
  try {
    const {
      company_id,
      group_name,
      group_type,
      description,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO groups
      (company_id, group_name, group_type, description)
      VALUES ($1,$2,$3,$4)
      RETURNING *`,
      [
        company_id,
        group_name,
        group_type,
        description,
      ]
    );

    res.json({
      success: true,
      group: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Groups
const getGroups = async (req, res) => {
  try {
    const { companyId } = req.params;

    const result = await pool.query(
      "SELECT * FROM groups WHERE company_id=$1 ORDER BY id DESC",
      [companyId]
    );

    res.json({
      success: true,
      groups: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Group
const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM groups WHERE id=$1",
      [id]
    );

    res.json({
      success: true,
      group: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Group
const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      group_name,
      group_type,
      description,
    } = req.body;

    const result = await pool.query(
      `UPDATE groups
       SET
       group_name=$1,
       group_type=$2,
       description=$3
       WHERE id=$4
       RETURNING *`,
      [
        group_name,
        group_type,
        description,
        id,
      ]
    );

    res.json({
      success: true,
      group: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Group

// Search Group
const searchGroup = async (req, res) => {
  try {
    const { name } = req.query;

    const result = await pool.query(
      "SELECT * FROM groups WHERE group_name ILIKE $1",
      [`%${name}%`]
    );

    res.json({
      success: true,
      groups: result.rows,
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
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  searchGroup,
};