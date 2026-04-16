const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByCustomer,
  updateOrder,
  deleteOrder,
  getOrdersByStaffAndDate,
  getAssignedOrdersByStaff,
} = require("../controllers/orderController");

// Admin xem tất cả đơn
router.get("/", getAllOrders);
// Khách hàng đặt dịch vụ
// Lấy đơn theo ID
router.get("/:id", getOrderById);
// Lấy đơn theo khách hàng
router.get("/customer/:customerId", getOrdersByCustomer);
// Staff xem lịch làm việc
router.get("/staff/:staffId", getOrdersByStaffAndDate);
router.get("/assigned/:staffId", getAssignedOrdersByStaff);
router.post("/", createOrder);
// ✅ API update chung (assign staff, status, thời gian,...)
router.patch("/:orderId", updateOrder);
// Xóa đơn
router.delete("/:id", deleteOrder);

module.exports = router;
