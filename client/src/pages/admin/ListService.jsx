import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function ServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/services/getall");
      setServices(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy dịch vụ:", err);
      toast.error("Không thể tải dữ liệu dịch vụ!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/services/delete/${id}`);
      toast.success("Dịch vụ đã xóa thành công!");
      fetchServices();
    } catch (err) {
      console.error(err);
      toast.error("Xóa dịch vụ thất bại!");
    }
  };

  // Pagination
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const currentServices = services.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  if (loading) return <p className="p-6 text-center text-gray-500">Đang tải...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Danh sách dịch vụ</h1>
        <Link
          to="/admin-dashboard/services/add"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          + Thêm dịch vụ
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["Tên", "Mô tả", "Giá", "Thời lượng (phút)", "Trạng thái", "Hành động"].map(
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
            {currentServices.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500 font-medium">
                  Chưa có dịch vụ nào
                </td>
              </tr>
            )}
            {currentServices.map((service) => (
              <tr key={service._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{service.name}</td>
                <td className="px-4 py-2">{service.description || "-"}</td>
                <td className="px-4 py-2">{service.price.toLocaleString()} đ</td>
                <td className="px-4 py-2">{service.duration || "-"}</td>
                <td className="px-4 py-2">
                  {service.active ? (
                    <span className="text-green-600 font-semibold">Hoạt động</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Không hoạt động</span>
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2 justify-center">
                  <Link
                    to={`/admin-dashboard/services/${service._id}`}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
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
