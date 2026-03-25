const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

router.post("/create", employeeController.createEmployee);
router.get("/branch/:branchId/availability", employeeController.getEmployeesByBranchWithStatus);
router.get("/by-branch/:branchId", employeeController.getEmployeesByBranch);
router.get("/branch/:branchId", employeeController.getBranchOrder);
router.get("/getall", employeeController.getAllEmployees);
router.get("/get/:id", employeeController.getEmployeeById);
router.put("/update/:id", employeeController.updateEmployee);
router.delete("/delete/:id", employeeController.deleteEmployee);

module.exports = router;
