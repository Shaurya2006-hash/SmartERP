const pool = require("../config/db");

// Create Stock Group
const createStockGroup = async (req, res) => {
  try {
    const {
      company_id,
      group_name,
      description,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO stock_groups
      (company_id, group_name, description)
      VALUES ($1,$2,$3)
      RETURNING *`,
      [
        company_id,
        group_name,
        description,
      ]
    );

    res.json({
      success: true,
      stockGroup: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Stock Groups
const getStockGroups = async (req, res) => {
  try {

    const { companyId } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM stock_groups
       WHERE company_id=$1
       ORDER BY id DESC`,
      [companyId]
    );

    res.json({
      success: true,
      stockGroups: result.rows,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success:false,
      message:error.message,
    });

  }
};

// Get Stock Group By Id
const getStockGroupById = async (req,res)=>{

  try{

    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM stock_groups WHERE id=$1",
      [id]
    );

    res.json({
      success:true,
      stockGroup:result.rows[0],
    });

  }catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:error.message,
    });

  }

};

// Update Stock Group
const updateStockGroup = async (req,res)=>{

  try{

    const { id } = req.params;

    const {
      group_name,
      description,
    } = req.body;

    const result = await pool.query(

      `UPDATE stock_groups
       SET
       group_name=$1,
       description=$2
       WHERE id=$3
       RETURNING *`,

      [
        group_name,
        description,
        id,
      ]

    );

    res.json({
      success:true,
      stockGroup:result.rows[0],
    });

  }catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:error.message,
    });

  }

};

// Delete Stock Group
const deleteStockGroup = async(req,res)=>{

  try{

    const { id } = req.params;

    await pool.query(
      "DELETE FROM stock_groups WHERE id=$1",
      [id]
    );

    res.json({
      success:true,
      message:"Stock Group Deleted Successfully",
    });

  }catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:error.message,
    });

  }

};

// Search Stock Group
const searchStockGroup = async(req,res)=>{

  try{

    const { name } = req.query;

    const result = await pool.query(

      `SELECT *
       FROM stock_groups
       WHERE group_name ILIKE $1`,

      [`%${name}%`]

    );

    res.json({
      success:true,
      stockGroups:result.rows,
    });

  }catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:error.message,
    });

  }

};

module.exports={
  createStockGroup,
  getStockGroups,
  getStockGroupById,
  updateStockGroup,
  deleteStockGroup,
  searchStockGroup,
};