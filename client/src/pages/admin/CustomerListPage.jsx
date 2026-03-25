import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customers/getall");
      setCustomers(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách khách hàng:", err);
      toast.error("Lấy danh sách khách hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/customers/delete/${id}`);
      toast.success("Xóa khách hàng thành công!");
      fetchCustomers();
    } catch (err) {
      console.error("Lỗi khi xóa khách hàng:", err);
      toast.error("Xóa khách hàng thất bại");
    }
  };

  // Pagination
  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const currentCustomers = customers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  if (loading)
    return <p className="p-6 text-center text-gray-500">Đang tải danh sách khách hàng...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Quản lý Khách hàng</h1>
        <Link
          to="/admin-dashboard/customers/add"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Thêm khách hàng
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["Tên", "Email", "SĐT", "Địa chỉ", "Hành động"].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentCustomers.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">
                  Không có khách hàng nào.
                </td>
              </tr>
            )}
            {currentCustomers.map((cust) => (
              <tr key={cust._id} className="hover:bg-gray-50 transition">
         
                <td className="px-4 py-2">{cust.name || "-"}</td>
                <td className="px-4 py-2">{cust.email || "-"}</td>
                <td className="px-4 py-2">{cust.phone || "-"}</td>
                <td className="px-4 py-2">{cust.address || "-"}</td>
                <td className="px-4 py-2 flex gap-2 justify-center">
                  <Link
                    to={`/admin-dashboard/customers/${cust._id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(cust._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
                  ? "bg-green-600 text-white"
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
