const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

// CRUD dịch vụ
router.get("/getall", serviceController.getAllServices);
router.get("/get/:id", serviceController.getServiceById);

router.get("/:serviceId/reviews", serviceController.getReviewsForService);
router.post("/:serviceId/reviews", serviceController.addReviewToService);
router.post("/create", serviceController.createService);
router.put("/update/:id", serviceController.updateService);
router.delete("/delete/:id", serviceController.deleteService);

module.exports = router;
