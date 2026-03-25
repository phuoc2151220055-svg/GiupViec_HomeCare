import React, { useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  ListChecks,
  UserRound,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Meta from "../../components/Meta";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderHistory({ customerId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!customerId) {
          setLoading(false);
          return;
        }
        const res = await axios.get(
          `http://localhost:5000/api/orders/customer/${customerId}`
        );
        setOrders(res.data || []);
      } catch (err) {
        console.error("Lỗi lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [customerId]);

  const renderStatus = (status) => {
    const styles = {
      pending: "text-yellow-700 bg-yellow-100",
      accepted: "text-blue-700 bg-blue-100",
      in_progress: "text-teal-700 bg-teal-100",
      completed: "text-green-700 bg-green-100",
      canceled: "text-red-700 bg-red-100",
    };
    const icons = {
      pending: <Clock size={14} className="mr-1" />,
      accepted: <CheckCircle2 size={14} className="mr-1" />,
      in_progress: <Clock size={14} className="mr-1" />,
      completed: <CheckCircle2 size={14} className="mr-1" />,
      canceled: <XCircle size={14} className="mr-1" />,
    };
    const labels = {
      pending: "Chờ xác nhận",
      accepted: "Đã nhận",
      in_progress: "Đang thực hiện",
      completed: "Hoàn thành",
      canceled: "Đã hủy",
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}
      >
        {icons[status]} {labels[status]}
      </span>
    );
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-teal-600 mb-2" size={40} />
        <p className="text-gray-500">Đang tải đơn hàng của bạn...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-4">
      <Meta title={"Lịch sử đơn hàng"} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center mb-10">
          <ListChecks className="text-teal-600 mr-2" size={34} />
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Lịch sử đơn dịch vụ
          </h1>
        </div>

        {/* Content */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-500 bg-white py-16 rounded-2xl shadow-lg"
          >
            <Clock size={40} className="mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium">
              Bạn chưa có đơn dịch vụ nào được tạo.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div
              layout
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {orders.map((order, i) => (
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 cursor-pointer transition-all duration-300 overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-5 border-b flex justify-between items-start bg-gradient-to-r from-teal-50 to-white">
                    <div>
                      <h2 className="font-semibold text-lg text-teal-700 group-hover:text-teal-800 transition">
                        {order.service?.name}
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">
                        Mã đơn: {order._id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                    {renderStatus(order.status)}
                  </div>

                  {/* Body */}
                  <div className="p-5 text-sm text-gray-600 space-y-3">
                    <p className="flex items-center">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      {new Date(order.scheduledAt).toLocaleDateString("vi-VN")}{" "}
                      lúc{" "}
                      {new Date(order.scheduledAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    <p className="flex items-center">
                      <UserRound size={16} className="mr-2 text-gray-400" />
                      <span className="font-medium mr-1">Nhân viên:</span>
                      {order.staff
                        ? order.staff.name || order.staff.email
                        : "⏳ Chờ phân công"}
                    </p>

                    <p className="flex items-center">
                      <CreditCard size={16} className="mr-2 text-gray-400" />
                      <span className="font-medium mr-1">Thanh toán:</span>
                      {order.paymentMethod === "COD"
                        ? "Khi hoàn thành"
                        : "Online (Momo)"}
                    </p>

                    <div className="pt-3 border-t">
                      <p className="font-semibold text-gray-800 text-lg flex justify-between">
                        Tổng tiền:
                        <span className="text-teal-600">
                          {order.service?.price?.toLocaleString("vi-VN")}₫
                        </span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
