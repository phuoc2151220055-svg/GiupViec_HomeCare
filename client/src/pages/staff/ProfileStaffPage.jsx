import { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Phone, Briefcase, Building2 } from "lucide-react";
import Meta from "../../components/Meta";

export default function ProfileStaffPage() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const sessionUser = JSON.parse(sessionStorage.getItem("user"));
      if (!sessionUser?.id) return;

      const employeeRes = await axios.get(`http://localhost:5000/api/employees/get/${sessionUser.id}`);
      setEmployee(employeeRes.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p className="p-6 text-center">⏳ Đang tải hồ sơ...</p>;
  if (!employee) return <p className="p-6 text-center">Không tìm thấy thông tin nhân viên...</p>;

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return (
    <div className="mx-auto p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Trang cá nhân của bạn</h1>
        <button
          onClick={refreshProfile}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Làm mới thông tin
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6 flex items-start gap-6">
        <img
          src={
            employee.avatarUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}`
          }
          alt={employee.name}
          className="w-24 h-24 rounded-full border-2 border-indigo-500 object-cover"
        />

        <div>
          <h1 className="text-2xl font-bold text-gray-800">{employee.name}</h1>
          <p className="text-gray-600 flex py-1 items-center gap-2"><Mail size={16}/> {employee.email}</p>
          <p className="text-gray-600 flex py-1 items-center gap-2"><Phone size={16}/> {employee.phone || "Chưa có số điện thoại"}</p>
          <p className="text-gray-600 flex py-1 items-center gap-2"><Briefcase size={16}/> Vai trò: <span className="capitalize">{employee.role}</span></p>
          <p className="text-gray-600 flex py-1 items-center gap-2"><Building2 size={16}/> Chi nhánh: {employee.branch?.name || "Chưa được gán"}</p>
        </div>
      </div>
    </div>
  );
}

