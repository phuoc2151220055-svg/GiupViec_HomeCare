import { useEffect, useState } from "react";
import axios from "axios";
import AssignForm from "../../components/admin/AssignForm";

export default function AssignShiftsPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Lỗi fetch orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📋 Danh sách đơn hàng</h1>

      {orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500 border rounded-lg bg-gray-50">
          Không có đơn hàng nào
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Khách hàng</th>
                <th className="p-3 text-left">Dịch vụ</th>
                <th className="p-3 text-left">Nhân viên</th>
                <th className="p-3 text-left">Thời gian</th>
                <th className="p-3 text-left">Trạng thái</th>
                <th className="p-3 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr
                  key={order._id}
                  className={`border-t hover:bg-gray-50 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3">{order.customer?.name}</td>
                  <td className="p-3">{order.service?.name}</td>
                  <td className="p-3">
                    {order.staff?.name || (
                      <span className="text-gray-400 italic">Chưa phân công</span>
                    )}
                  </td>
                  <td className="p-3">
                    {order.scheduledAt
                      ? new Date(order.scheduledAt).toLocaleString("vi-VN")
                      : "—"}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedOrder(order._id)}
                      className="px-3 py-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Chỉnh sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <AssignForm
          orderId={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSuccess={fetchOrders}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-700",
    assigned: "bg-blue-100 text-blue-700",
    "in-progress": "bg-indigo-100 text-indigo-700",
    completed: "bg-green-100 text-green-700",
    canceled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
