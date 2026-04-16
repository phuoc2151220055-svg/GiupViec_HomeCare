import { useEffect, useState } from "react";
import axios from "axios";

export default function StaffSchedulePage() {
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const staffId = user?.id || user?._id || "";

  const getToday = () => new Date().toISOString().split("T")[0];

  const fetchOrders = async (date) => {
    if (!staffId) {
      console.warn("Staff không xác định, không lấy được lịch.");
      setOrders([]);
      return;
    }

    try {
      let url = `http://localhost:5000/api/orders/staff/${staffId}`;
      if (date) url += `?date=${date}`;
      const res = await axios.get(url);
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders failed:", err);
    }
  };

  useEffect(() => {
    if (staffId) {
      const today = getToday();
      setSelectedDate(today);
      fetchOrders(today);
    }
  }, [staffId]);

  useEffect(() => {
    if (staffId && selectedDate) {
      fetchOrders(selectedDate);
    }
  }, [selectedDate, staffId]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${orderId}`, {
        status: newStatus,
        staffId: staffId, // Send staffId so backend can get staff info
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Update status failed:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        📅 Lịch làm việc của <span className="text-blue-600">{user?.name}</span>
      </h1>

      {/* Bộ lọc ngày */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Chọn ngày:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500 border rounded-lg bg-gray-50">
          Không có lịch làm việc.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-lg p-4 border space-y-3 hover:shadow-lg transition"
            >
              {/* Giờ hẹn */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-blue-600">
                  {order.startTime && order.endTime ? (
                    `${new Date(order.startTime).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} - ${new Date(order.endTime).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  ) : order.endTime ? (
                    new Date(order.endTime).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  ) : order.scheduledAt ? (
                    new Date(order.scheduledAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  ) : (
                    "Chưa đặt giờ"
                  )}
                </span>
                <StatusBadge status={order.status} />
              </div>

              {/* Khách hàng */}
              <div>
                <p className="text-sm text-gray-500">Khách hàng</p>
                <p className="font-medium">{order.customer?.name}</p>
              </div>

              {/* Dịch vụ */}
              <div>
                <p className="text-sm text-gray-500">Dịch vụ</p>
                <p className="font-medium">
                  {order.service?.name}{" "}
                  {order.service?.price && (
                    <span className="text-sm text-gray-500">
                      ({order.service.price.toLocaleString("vi-VN")}đ)
                    </span>
                  )}
                </p>
              </div>

              {/* Chi nhánh */}
              <div>
                <p className="text-sm text-gray-500">Chi nhánh</p>
                <p className="font-medium">{order.branch?.name}</p>
                <p className="text-xs text-gray-500">{order.branch?.address}</p>
              </div>

              {/* Trạng thái (dropdown) */}
              <div>
                <label className="text-sm text-gray-500">Cập nhật trạng thái</label>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="w-full mt-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="assigning">Đang phân công</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="accepted">Đã nhận</option>
                  <option value="in_progress">Đang làm</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="canceled">Đã hủy</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    assigning: "bg-gray-100 text-gray-700",
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-blue-100 text-blue-700",
    in_progress: "bg-indigo-100 text-indigo-700",
    completed: "bg-green-100 text-green-700",
    canceled: "bg-red-100 text-red-700",
  };

  const labels = {
    assigning: "Đang phân công",
    pending: "Chờ xử lý",
    accepted: "Đã nhận",
    in_progress: "Đang làm",
    completed: "Hoàn thành",
    canceled: "Đã hủy",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}
