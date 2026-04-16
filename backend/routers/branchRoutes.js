const express = require("express");
const router = express.Router();
const branchController = require("../controllers/branchController.controller");

router.post("/create", branchController.createBranch);
router.get("/getall", branchController.getAllBranches);
router.get("/get/:id", branchController.getBranchById);
router.put("/update/:id", branchController.updateBranch);
router.delete("/delete/:id", branchController.deleteBranch);

module.exports = router;
