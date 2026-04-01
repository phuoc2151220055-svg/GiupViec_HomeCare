import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Mock dữ liệu test
const mockOrders = [
  {
    _id: "1",
    customer: { name: "Nguyen Van A" },
    branch: { name: "Chi nhánh 1" },
    products: [{ product: { name: "Cắt tóc" }, quantity: 1 }],
    totalAmount: 100000,
    status: "pending",
  },
  {
    _id: "2",
    customer: { name: "Tran Van B" },
    branch: { name: "Chi nhánh 2" },
    products: [{ product: { name: "Nhuộm tóc" }, quantity: 1 }],
    totalAmount: 200000,
    status: "completed",
  },
];

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Lấy dữ liệu mock
    setOrders(mockOrders);
  }, []);

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const currentOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Đơn đặt dịch vụ</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["#", "Khách hàng", "Chi nhánh", "Dịch vụ", "Tổng tiền", "Trạng thái", "Hành động"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentOrders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Chưa có đơn nào
                </td>
              </tr>
            )}
            {currentOrders.map((order, idx) => (
              <tr key={order._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                <td className="px-4 py-2">{order.customer?.name || "Khách lẻ"}</td>
                <td className="px-4 py-2">{order.branch?.name || "-"}</td>
                <td className="px-4 py-2">
                  {order.products.map((p, index) => (
                    <div key={index}>
                      {p.product.name} x {p.quantity}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2">{order.totalAmount.toLocaleString()} ₫</td>
                <td className="px-4 py-2 capitalize">{order.status.replace("_", " ")}</td>
                <td className="px-4 py-2">
                  <Link
                    to={`/admin-dashboard/orders/${order._id}`}
                    className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                  >
                    Xem
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === idx + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
