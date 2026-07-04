const pool = require("../config/db");

// Create Stock Item
const createStockItem = async (req, res) => {
  try {

    const {
      company_id,
      stock_group_id,
      unit_id,
      item_name,
      sku,
      purchase_price,
      selling_price,
      quantity,
      gst_percentage,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO stock_items
      (
        company_id,
        stock_group_id,
        unit_id,
        item_name,
        sku,
        purchase_price,
        selling_price,
        quantity,
        gst_percentage
      )
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        company_id,
        stock_group_id,
        unit_id,
        item_name,
        sku,
        purchase_price,
        selling_price,
        quantity,
        gst_percentage,
      ]
    );

    res.json({
      success:true,
      stockItem:result.rows[0],
    });

  } catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:error.message,
    });

  }
};

// Get All Items
const getStockItems = async(req,res)=>{

  try{

    const { companyId } = req.params;

    const result = await pool.query(

      `SELECT
          stock_items.*,
          stock_groups.group_name,
          units.unit_name,
          units.unit_symbol

       FROM stock_items

       LEFT JOIN stock_groups
       ON stock_items.stock_group_id=stock_groups.id

       LEFT JOIN units
       ON stock_items.unit_id=units.id

       WHERE stock_items.company_id=$1

       ORDER BY stock_items.id DESC`,

      [companyId]

    );

    res.json({
      success:true,
      stockItems:result.rows,
    });

  }catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:error.message,
    });

  }

};

// Get By Id
const getStockItemById = async(req,res)=>{

  try{

    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM stock_items WHERE id=$1",
      [id]
    );

    res.json({
      success:true,
      stockItem:result.rows[0],
    });

  }catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:error.message,
    });

  }

};

// Update
const updateStockItem = async(req,res)=>{

  try{

    const { id } = req.params;

    const {
      stock_group_id,
      unit_id,
      item_name,
      sku,
      purchase_price,
      selling_price,
      quantity,
      gst_percentage,
    } = req.body;

    const result = await pool.query(

      `UPDATE stock_items
      SET

      stock_group_id=$1,
      unit_id=$2,
      item_name=$3,
      sku=$4,
      purchase_price=$5,
      selling_price=$6,
      quantity=$7,
      gst_percentage=$8

      WHERE id=$9

      RETURNING *`,

      [
        stock_group_id,
        unit_id,
        item_name,
        sku,
        purchase_price,
        selling_price,
        quantity,
        gst_percentage,
        id,
      ]

    );

    res.json({
      success:true,
      stockItem:result.rows[0],
    });

  }catch(error){

    console.error(error);

    res.status(500).json({
      success:false,
      message:error.message,
    });

  }

};



// Search
const searchStockItem = async(req,res)=>{

  try{

    const { name } = req.query;

    const result = await pool.query(

      `SELECT *
       FROM stock_items
       WHERE item_name ILIKE $1`,

      [`%${name}%`]

    );

    res.json({
      success:true,
      stockItems:result.rows,
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
createStockItem,
getStockItems,
getStockItemById,
updateStockItem,
searchStockItem,
};