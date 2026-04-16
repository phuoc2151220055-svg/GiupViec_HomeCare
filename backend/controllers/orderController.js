const Order = require("../models/OrderModel");
const Customer = require("../models/CustomerModel");
const User = require("../models/UserModel");
const Service = require("../models/ServiceModel");
const Branch = require("../models/BranchModel");
const { getIO, sendNotificationToCustomer } = require("../config/socketIO");

// 🧾 1️⃣ Tạo đơn hàng
const createOrder = async (req, res) => {
  try {
    const {
      customer,
      service,
      branch,
      province,
      district,
      ward,
      detailAddress,
      scheduledAt,
      pricingType,
      startTime,
      endTime,
      notes,
      paymentMethod,
      paymentStatus,
      staff, // nhân viên yêu thích (tùy chọn)
    } = req.body;

    // 🔸 Kiểm tra các trường bắt buộc
    if (
      !customer ||
      !service ||
      !scheduledAt ||
      !province ||
      !district ||
      !ward ||
      !detailAddress
    ) {
      return res.status(400).json({ error: "Thiếu thông tin địa chỉ hoặc thông tin bắt buộc" });
    }

    // 🔸 Kiểm tra khách hàng
    const customerDoc = await Customer.findById(customer);
    if (!customerDoc)
      return res.status(404).json({ error: "Không tìm thấy khách hàng" });

    // 🔸 Kiểm tra dịch vụ
    const serviceDoc = await Service.findById(service);
    if (!serviceDoc)
      return res.status(404).json({ error: "Không tìm thấy dịch vụ" });

    // 🔸 Xử lý tính giá
    const HOURLY_RATE = 150000;
    const PACKAGE_DISCOUNT = 0.2;

    let price = 0;
    let start = startTime ? new Date(startTime) : null;
    let end = endTime ? new Date(endTime) : null;
    const pricingMode = pricingType || serviceDoc.pricingType || "Theo giờ";

    if (pricingMode === "Theo giờ") {
      if (!start || !end || end <= start) {
        return res.status(400).json({
          error: "Thời gian bắt đầu / kết thúc không hợp lệ cho dịch vụ theo giờ",
        });
      }
      const hours = (end - start) / (1000 * 60 * 60);
      price = Math.round(HOURLY_RATE * hours);
    } else {
      // Trọn gói
      const PACKAGE_HOURS = 5;

      if (!start) {
        // Nếu chưa có start (không lúc), lấy scheduledAt
        if (!scheduledAt) {
          return res.status(400).json({
            error: "Vui lòng cung cấp thời gian bắt đầu cho gói trọn gói",
          });
        }
        start = new Date(scheduledAt);
      }

      end = new Date(start.getTime() + PACKAGE_HOURS * 60 * 60 * 1000);
      price = Math.round(PACKAGE_HOURS * HOURLY_RATE * (1 - PACKAGE_DISCOUNT));
    }

    if (Number.isNaN(price)) {
      return res.status(400).json({ error: "Không thể tính giá dịch vụ, vui lòng kiểm tra dữ liệu đầu vào" });
    }

    // 🔸 Tạo đơn hàng mới
    const order = new Order({
      customer,
      service,
      branch,
      scheduledAt,
      startTime: start,
      endTime: end,
      province,
      district,
      ward,
      detailAddress,
      notes,
      pricingType: pricingMode,
      price,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentStatus || "unpaid",
      status: "assigning",
    });

    // 🔸 Nếu có nhân viên yêu thích
    if (staff) {
      const favoriteStaff = await User.findById(staff);
      if (favoriteStaff) {
        order.staff = favoriteStaff._id;
        order.status = "pending"; // chờ nhân viên xác nhận
      }
    }

    // 🔸 Lưu đơn
    await order.save();

    // 🔸 Populate dữ liệu trả về
    const populated = await Order.findById(order._id)
      .populate("customer", "name phone")
      .populate("service", "name pricingType pricePerHour fixedPrice")
      .populate("branch", "name")
      .populate("staff", "name email");

    // 🔸 Gửi phản hồi thành công
    res.status(201).json({
      message: "Tạo đơn hàng thành công",
      order: populated,
    });
  } catch (err) {
    console.error("❌ Lỗi khi tạo đơn:", err);
    res.status(500).json({ error: err.message });
  }
};


// 📦 2️⃣ Lấy tất cả đơn hàng
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name phone email")
      .populate("staff", "name email phone")
      .populate("service", "name pricingType pricePerHour fixedPrice")
      .populate("branch", "name address");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 3️⃣ Lấy đơn theo ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name phone email")
      .populate("staff", "name email phone")
      .populate("service", "name pricingType pricePerHour fixedPrice")
      .populate("branch", "name address");

    if (!order) return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👤 4️⃣ Lấy đơn theo khách hàng
const getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await Order.find({ customer: customerId })
      .populate("service", "name pricingType pricePerHour fixedPrice")
      .populate("staff", "name email")
      .populate("branch", "name");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👷 5️⃣ Lấy đơn theo nhân viên (tất cả)
const getOrdersByStaffAndDate = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { date } = req.query;

    const query = { staff: staffId };
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.scheduledAt = { $gte: start, $lte: end };
    }

    const orders = await Order.find(query)
      .populate("customer", "name phone")
      .populate("service", "name pricingType")
      .populate("branch", "name address")
      .populate("staff", "name email");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🧑‍🔧 6️⃣ Lấy đơn được giao cho nhân viên (assigned orders)
const getAssignedOrdersByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const orders = await Order.find({ staff: staffId })
      .populate("customer", "name phone")
      .populate("service", "name pricingType")
      .populate("branch", "name");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper function to get notification message based on status
const getNotificationMessage = (status, staffName) => {
  const messages = {
    accepted: `${staffName} đã nhận đơn`,
    in_progress: `${staffName} đang thực hiện`,
    completed: `${staffName} đã hoàn thành đơn`,
    canceled: `${staffName} đã hủy đơn`,
    pending: `Chờ ${staffName} xác nhận`,
    assigning: `Đang phân công cho nhân viên`,
  };
  return messages[status] || `Trạng thái đơn hàng: ${status}`;
};

// ✏️ 7️⃣ Cập nhật đơn hàng
const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { staffId, ...restData } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Không tìm thấy đơn hàng" });

    // Track old status for notification
    const oldStatus = order.status;
    const newStatus = restData.status || order.status;

    if (staffId) {
      const staffUser = await User.findById(staffId);
      if (!staffUser) {
        return res.status(404).json({ error: "Không tìm thấy nhân viên" });
      }
      order.staff = staffUser._id;
      if (!restData.status) {
        order.status = "pending";
      }
    }

    Object.assign(order, restData);
    await order.save();

    // Emit notification if status changed
    if (newStatus !== oldStatus) {
      try {
        const populatedOrder = await Order.findById(orderId)
          .populate("customer", "name phone email _id clerkId")
          .populate("staff", "name email phone")
          .populate("service", "name");

        if (populatedOrder && populatedOrder.customer) {
          // Use clerkId to identify customer in socket
          const customerId = populatedOrder.customer.clerkId || populatedOrder.customer._id.toString();
          const staffName = populatedOrder.staff?.name || "Hệ thống";
          const notificationMessage = getNotificationMessage(newStatus, staffName);
          
          // Send notification to customer
          sendNotificationToCustomer(customerId, {
            type: "order_status",
            orderId: order._id,
            status: newStatus,
            staffName: staffName,
            message: notificationMessage,
            scheduledAt: populatedOrder.scheduledAt,
          });
        }
      } catch (err) {
        console.error("❌ Error sending notification:", err.message);
      }
    }

    const populated = await Order.findById(orderId)
      .populate("customer", "name phone email")
      .populate("staff", "name email phone")
      .populate("service", "name pricingType pricePerHour fixedPrice")
      .populate("branch", "name address");

    res.json({
      message: "Cập nhật đơn hàng thành công",
      order: populated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ 8️⃣ Xóa đơn hàng
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    res.json({ message: "Đã xóa đơn hàng" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 💖 9️⃣ Lấy nhân viên yêu thích của khách hàng
const getFavoriteStaffByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await Order.find({ customer: customerId, staff: { $ne: null } })
      .populate("staff", "name email phone branch");

    const unique = [];
    const seen = new Set();

    for (const o of orders) {
      if (o.staff && !seen.has(o.staff._id.toString())) {
        seen.add(o.staff._id.toString());
        unique.push(o.staff);
      }
    }

    res.json(unique);
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy nhân viên yêu thích" });
  }
};
 const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: "accepted",         // thể hiện là nhân viên đã nhận việc
          staffResponse: "accepted",  // phản hồi nhân viên
        },
      },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    console.error("Lỗi acceptOrder:", error);
    res.status(500).json({ message: "Không thể chấp nhận đơn hàng" });
  }
};
const getOrdersByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const orders = await Order.find({ staff: staffId })
      .populate("customer", "name email phone")
      .populate("service", "name")
      .populate("branch", "name")
      .populate("staff", "name");
    res.json(orders);
  } catch (err) {
    console.error("Lỗi khi lấy đơn của nhân viên:", err);
    res.status(500).json({ error: "Không thể lấy đơn hàng!" });
  }
};
// Nhân viên từ chối đơn
 const rejectOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: "assigning",         // quay lại trạng thái chờ phân công
          staffResponse: "rejected",   // phản hồi từ chối
        },
      },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    console.error("Lỗi rejectOrder:", error);
    res.status(500).json({ message: "Không thể từ chối đơn hàng" });
  }
};


const addReview = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rating, comment } = req.body;

    const order = await Order.findById(orderId).populate("staff service customer");
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn" });
    if (order.status !== "completed") return res.status(400).json({ message: "Chỉ review khi đơn đã hoàn thành" });
    if (!order.staff) return res.status(400).json({ message: "Chưa có nhân viên để review" });

    const staff = await User.findById(order.staff._id);

    // Tìm service trong capableServices
    const serviceIndex = staff.capableServices.findIndex(
      (cs) => cs.service.toString() === order.service._id.toString()
    );

    if (serviceIndex === -1) return res.status(400).json({ message: "Nhân viên không thực hiện dịch vụ này" });

    // Thêm review
    staff.capableServices[serviceIndex].reviews.push({
      customer: order.customer._id,
      rating,
      comment,
      order: order._id,
    });

    await staff.save();

    res.json({ message: "Review thành công", review: staff.capableServices[serviceIndex].reviews.at(-1) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByCustomer,
  getOrdersByStaffAndDate,
  getAssignedOrdersByStaff,
  updateOrder,
  deleteOrder,
  getFavoriteStaffByCustomer,acceptOrder,rejectOrder,getOrdersByStaff,
  addReview
};
