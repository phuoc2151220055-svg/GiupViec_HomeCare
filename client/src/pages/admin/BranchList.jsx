import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function BranchList() {
  const [branches, setBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // số chi nhánh mỗi trang

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/branches/getall");
      setBranches(res.data);
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa chi nhánh này?")) {
      try {
        await axios.delete(`http://localhost:5000/api/branches/delete/${id}`);
        fetchBranches();
        toast.success("Chi nhánh đã xoá thành công!");
      } catch (err) {
        console.error("Error deleting branch:", err);
      }
    }
  };

  const totalPages = Math.ceil(branches.length / itemsPerPage);
  const currentBranches = branches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Danh sách chi nhánh</h1>
        <Link
          to="/admin-dashboard/branches/add"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          + Thêm chi nhánh
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["Tên", "Địa chỉ", "Điện thoại", "Doanh thu", "Hành động"].map(
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
            {currentBranches.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500 font-medium">
                  Chưa có chi nhánh nào
                </td>
              </tr>
            )}
            {currentBranches.map((branch) => (
              <tr key={branch._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{branch.name}</td>
                <td className="px-4 py-2">{branch.address}</td>
                <td className="px-4 py-2">{branch.phone}</td>
                <td className="px-4 py-2">{branch.revenue != null ? branch.revenue.toLocaleString() : "-"} đ</td>
                <td className="px-4 py-2 flex gap-2 justify-center">
                  <Link
                    to={`/admin-dashboard/branches/${branch._id}`}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(branch._id)}
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
