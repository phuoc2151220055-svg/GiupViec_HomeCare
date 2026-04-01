import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeForm from "../../components/admin/EmployeeForm";
import { Link } from "lucide-react";
import toast from "react-hot-toast";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/branches/getall").then((res) => setBranches(res.data));
  }, []);

  const handleSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/employees/create", data);
      toast.success("Nhân viên đã tạo thành công!");
      setTimeout(() =>navigate("/admin-dashboard/employees"),700);
    } catch (err) {
      console.error("Lỗi thêm nhân viên:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Thêm nhân viên mới</h1>
        <Link   
          to="/admin-dashboard/employees"
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Quay lại
        </Link>
      </div>
      <EmployeeForm onSubmit={handleSubmit} branches={branches} />
    </div>
  );
}
