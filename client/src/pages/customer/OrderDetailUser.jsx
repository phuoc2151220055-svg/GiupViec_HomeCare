import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  User,
  MapPin,
  Wallet,
  Loader2,
  XCircle,
  UserRound,
  Phone,
  Mail,
} from "lucide-react";
import axios from "axios";
import Meta from "../../components/Meta";

export default function OrderDetailUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Lỗi lấy chi tiết đơn:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const renderStatus = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-full">
            <Clock size={16} className="mr-1" /> Chờ xác nhận
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
            <CheckCircle2 size={16} className="mr-1" /> Đã nhận
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-teal-700 bg-teal-100 rounded-full">
            <Clock size={16} className="mr-1" /> Đang thực hiện
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
            <CheckCircle2 size={16} className="mr-1" /> Hoàn thành
          </span>
        );
      case "canceled":
        return (
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full">
            <XCircle size={16} className="mr-1" /> Đã hủy
          </span>
        );
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-teal-600" size={40} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Không tìm thấy đơn hàng.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Meta title={"Chi tiết đơn hàng"} />
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-teal-600"
          >
            <ArrowLeft className="mr-2" size={20} /> Quay lại
          </button>
          {renderStatus(order.status)}
        </div>

        {/* Service */}
        <h1 className="text-2xl font-bold text-teal-700 mb-4">
          {order.service?.name}
        </h1>

        {/* Order Details */}
        <div className="space-y-4 text-gray-700">
          <p className="flex items-center">
            <Calendar className="mr-2 text-gray-400" size={18} />
            Thời gian:{" "}
            <span className="ml-1 font-medium">
              {new Date(order.scheduledAt).toLocaleDateString("vi-VN")}{" "}
              {new Date(order.scheduledAt).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </p>
          <p className="flex items-center">
            <User className="mr-2 text-gray-400" size={18} />
            Khách hàng:{" "}
            <span className="ml-1 font-medium">{order.customer?.name}</span>
          </p>
          <p className="flex items-center">
            <MapPin className="mr-2 text-gray-400" size={18} />
            Địa chỉ:{" "}
            <span className="ml-1 font-medium">{order.customer?.address}</span>
          </p>
          <p className="flex items-center">
            <Wallet className="mr-2 text-gray-400" size={18} />
            Thanh toán:{" "}
            <span className="ml-1 font-medium">
              {order.paymentMethod === "COD" ? "Khi hoàn thành" : "Online"} -{" "}
              {order.paymentStatus === "paid"
                ? "Đã thanh toán"
                : "Chưa thanh toán"}
            </span>
          </p>
          <p className="text-lg font-semibold text-gray-800">
            Tổng tiền: {order.service?.price?.toLocaleString("vi-VN")} VND
          </p>
          {order.notes && (
            <p className="bg-gray-50 p-3 rounded-lg text-sm">
              <span className="font-medium">Ghi chú:</span> {order.notes}
            </p>
          )}
        </div>

        {/* Staff Info */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Nhân viên phụ trách
          </h2>
          {order.staff ? (
            <div className="bg-gray-50 p-4 rounded-lg border flex items-start space-x-4">
              <UserRound className="text-teal-600 mt-1" size={28} />
              <div>
                <p className="font-medium text-gray-900">
                  {order.staff.name || "Chưa có tên"}
                </p>
                <p className="flex items-center text-sm text-gray-600">
                  <Phone size={14} className="mr-1 text-gray-400" />{" "}
                  {order.staff.phone || "Không có số"}
                </p>
                <p className="flex items-center text-sm text-gray-600">
                  <Mail size={14} className="mr-1 text-gray-400" />{" "}
                  {order.staff.email || "Không có email"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">⏳ Chưa phân công nhân viên.</p>
          )}
        </div>
      </div>
    </div>
  );
}