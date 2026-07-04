const express = require("express");
const router = express.Router();

const {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  searchGroup,
} = require("../controllers/groupController");

router.post("/create", createGroup);

router.get("/all/:companyId", getGroups);

router.get("/:id", getGroupById);

router.put("/update/:id", updateGroup);


router.get("/search", searchGroup);

// Export the router, not the controller functions
module.exports = router;