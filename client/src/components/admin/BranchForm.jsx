import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function BranchForm() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    revenue: 0,
  });

  const navigate = useNavigate();
  const { id } = useParams(); // nếu có id → đang update

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/branches/get/${id}`).then((res) => {
        setForm(res.data);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/branches/update/${id}`, form);
        toast.success("Cập nhật chi nhánh thành công!");
      } else {
        await axios.post("http://localhost:5000/api/branches/create", form);
        toast.success("Thêm chi nhánh thành công!");
      }
      navigate("/admin-dashboard/branches");
    } catch (err) {
      console.error("Error saving branch:", err);
    }
  };

  return (
    <div className="w-full bg-white shadow-md p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? "Cập nhật chi nhánh" : "Thêm chi nhánh mới"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        {/* Tên chi nhánh */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Tên chi nhánh
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nhập tên chi nhánh"
            className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            required
          />
        </div>

        {/* Địa chỉ */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Nhập địa chỉ"
            className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            required
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Số điện thoại
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring focus:ring-indigo-200 focus:border-indigo-500"
          />
        </div>

        {/* Doanh thu */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Doanh thu
          </label>
          <input
            type="number"
            name="revenue"
            value={form.revenue}
            onChange={handleChange}
            placeholder="Nhập doanh thu"
            className="border border-gray-300 px-3 py-2 rounded-lg w-full focus:ring focus:ring-indigo-200 focus:border-indigo-500"
          />
        </div>

        {/* Nút submit */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition"
        >
          {id ? "Cập nhật" : "Thêm mới"}
        </button>
      </form>
    </div>
  );
}
