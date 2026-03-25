import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// Mock data test
const mockOrders = [
  {
    _id: "1",
    customer: { name: "Nguyen Van A" },
    branch: { name: "Chi nhánh 1" },
    totalAmount: 100000,
    paymentMethod: "Tiền mặt",
    status: "pending",
    products: [{ product: { _id: "p1", name: "Cắt tóc" }, quantity: 1, price: 100000 }],
  },
  {
    _id: "2",
    customer: { name: "Tran Van B" },
    branch: { name: "Chi nhánh 2" },
    totalAmount: 200000,
    paymentMethod: "Ví MoMo",
    status: "completed",
    products: [{ product: { _id: "p2", name: "Nhuộm tóc" }, quantity: 1, price: 200000 }],
  },
];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Lấy dữ liệu mock dựa trên id
    const found = mockOrders.find((o) => o._id === id);
    setOrder(found || null);
  }, [id]);

  const handleStatusChange = (newStatus) => {
    // Tạm thời update trạng thái local
    setOrder((prev) => ({ ...prev, status: newStatus }));
  };

  if (!order) return <p>Đang tải...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
        <Link
          to="/admin-dashboard/orders"
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Quay lại
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-4 max-w-3xl">
        <p><strong>Khách hàng:</strong> {order.customer?.name || "Khách lẻ"}</p>
        <p><strong>Chi nhánh:</strong> {order.branch?.name || "-"}</p>
        <p><strong>Tổng tiền:</strong> {order.totalAmount.toLocaleString()} ₫</p>
        <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
        <p><strong>Trạng thái:</strong> {order.status.replace("_", " ")}</p>

        <div>
          <strong>Dịch vụ:</strong>
          <ul className="list-disc ml-5">
            {order.products.map((p) => (
              <li key={p.product._id}>
                {p.product.name} x {p.quantity} - {p.price.toLocaleString()} ₫
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 mt-4">
          {order.status !== "completed" && order.status !== "canceled" && (
            <>
              <button
                onClick={() => handleStatusChange("completed")}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Hoàn thành
              </button>
              <button
                onClick={() => handleStatusChange("canceled")}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Hủy đơn
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
