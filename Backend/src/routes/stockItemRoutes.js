const express=require("express");

const router=express.Router();

const{

createStockItem,
getStockItems,
getStockItemById,
updateStockItem,
deleteStockItem,
searchStockItem,

}=require("../controllers/stockItemController");

router.post("/create",createStockItem);

router.get("/all/:companyId",getStockItems);

router.get("/search",searchStockItem);

router.get("/:id",getStockItemById);

router.put("/update/:id",updateStockItem);

router.delete("/delete/:id",deleteStockItem);

module.exports=router;