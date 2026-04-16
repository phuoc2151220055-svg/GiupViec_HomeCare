import { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, Phone, Briefcase, Building2, Clock } from "lucide-react";

export default function ProfilePage() {
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    console.log("object ",user)
    // Lấy user từ sessionStorage
    if (user) {
      axios
        .get(`http://localhost:5000/api/employees/get/${user.id}`)
        .then((res) => setEmployee(res.data))
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, []);

  if (!employee) return <p>Đang tải hồ sơ...</p>;

  return (
    <div className=" mx-auto p-8">
      {/* Thông tin cơ bản */}
      <div className="bg-white shadow rounded-lg p-6 flex items-start gap-6">
        <img
          src={
            employee.avatar ||
            "https://ui-avatars.com/api/?name=" + encodeURIComponent(employee.name)
          }
          alt={employee.name}
          className="w-24 h-24 rounded-full border-2 border-indigo-500 object-cover"
        />

        <div>
          <h1 className="text-2xl font-bold text-gray-800">{employee.name}</h1>
          <p className="text-gray-600 flex py-1 items-center gap-2">
            <Mail size={16} /> {employee.email}
          </p>
          <p className="text-gray-600 flex py-1 items-center gap-2">
            <Phone size={16} /> {employee.phone || "Chưa có số điện thoại"}
          </p>
          <p className="text-gray-600 flex py-1 items-center gap-2">
            <Briefcase size={16} /> Vai trò:{" "}
            <span className="capitalize">{employee.role}</span>
          </p>
          <p className="text-gray-600 flex py-1 items-center gap-2">
            <Building2 size={16} /> Chi nhánh:{" "}
            {employee.branch?.name || "Chưa được gán"}
          </p>
        </div>
      </div>

      {/* Lịch sử ca làm */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock size={18} className="text-indigo-600" />
          Lịch sử ca làm
        </h2>

        {employee.shifts && employee.shifts.length > 0 ? (
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Ngày</th>
                <th className="border px-4 py-2 text-left">Bắt đầu</th>
                <th className="border px-4 py-2 text-left">Kết thúc</th>
              </tr>
            </thead>
            <tbody>
              {employee.shifts.map((shift, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-2">
                    {new Date(shift.date).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="border px-4 py-2">{shift.startTime}</td>
                  <td className="border px-4 py-2">{shift.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">Chưa có ca làm nào được ghi nhận.</p>
        )}
      </div>
    </div>
  );
}
