const express = require("express");
const router = express.Router();
const {
  createWorkAssignment,
  getAllWorkAssignments,
  getAssignmentsByStaff,
  updateAssignmentStatus,
  getAssignmentsByStaffAndDate,
} = require("../controllers/workAssignmentController");

// Admin tạo phân công
router.post("/create", createWorkAssignment);

// Admin xem tất cả phân công
router.get("/all", getAllWorkAssignments);

// Nhân viên xem phân công của mình
router.get("/staff/:staffId", getAssignmentsByStaff);

// Cập nhật trạng thái công việc
router.put("/update-status/:id", updateAssignmentStatus);

router.get("/staff/:staffId/date", getAssignmentsByStaffAndDate);

module.exports = router;
