import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeForm from "../../components/admin/CustomerForm";
import { Link } from "lucide-react";
import toast from 'react-hot-toast'
export default function EditCustomers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/customers/get/${id}`).then((res) => setEmployee(res.data));
    axios.get("http://localhost:5000/api/branches/getall").then((res) => setBranches(res.data));
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      await axios.put(`http://localhost:5000/api/customers/update/${id}`, data);
      toast.success("Nhân viên đã được cập nhật thành công!");
      setTimeout(() => navigate("/admin-dashboard/customers"), 700);
    } catch (err) {
      console.error("Lỗi cập nhật nhân viên:", err);
    }
  };

  if (!employee) return <p>Đang tải...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Cập nhật nhân viên</h1>
        <Link
          to="/admin-dashboard/employees"
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Quay lại
        </Link>
      </div>
      <EmployeeForm onSubmit={handleSubmit} initialData={employee} branches={branches} />
    </div>
  );
}
