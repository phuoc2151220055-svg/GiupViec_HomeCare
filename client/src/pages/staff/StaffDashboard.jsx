import { useEffect, useState } from "react";
import axios from "axios";
import { User, Briefcase, Building2, Clock, CheckCircle, ListChecks } from "lucide-react";

export default function StaffDashboard() {
  const [employee, setEmployee] = useState(null);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("user");
    if (!sessionUser) return;

    const { id } = JSON.parse(sessionUser);

    const fetchData = async () => {
      try {
        const empRes = await axios.get(`http://localhost:5000/api/employees/get/${id}`);
        setEmployee(empRes.data);

        const orderRes = await axios
          .get(`http://localhost:5000/api/orders/assigned/${id}`)
          .catch(() => ({
            data: [
              { _id: "DH001", status: "pending" },
              { _id: "DH002", status: "completed" },
            ],
          }));
        setAssignedOrders(orderRes.data || []);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-6 text-center">⏳ Đang tải trang chủ...</p>;

  const refreshStaffData = async () => {
    setLoading(true);
    try {
      const sessionUser = JSON.parse(sessionStorage.getItem("user"));
      if (!sessionUser?.id) return;
      const empRes = await axios.get(`http://localhost:5000/api/employees/get/${sessionUser.id}`);
      setEmployee(empRes.data);
      const orderRes = await axios.get(`http://localhost:5000/api/orders/assigned/${sessionUser.id}`);
      setAssignedOrders(orderRes.data);
    } catch (err) {
      console.error("Lỗi làm mới dữ liệu staff:", err);
    } finally {
      setLoading(false);
    }
  };

  const completedOrders = assignedOrders.filter(o => o.status === "completed").length;
  const processingOrders = assignedOrders.filter(o => o.status !== "completed").length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          👋 Xin chào, <span className="text-green-600">{employee?.name}</span>
        </h1>
        <button
          onClick={refreshStaffData}
          className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Làm mới ca làm
        </button>
      </div>

      {/* Thông tin nhân viên */}
      <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 hover:shadow-2xl transition">
        <img
          src={
            employee?.avatarUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.name)}&background=34d399&color=fff`
          }
          alt={employee?.name}
          className="w-28 h-28 rounded-full border-4 border-green-400 object-cover"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">{employee?.name}</h2>
          <p className="text-gray-600 flex items-center gap-2 py-1"><User size={18}/> {employee?.email}</p>
          <p className="text-gray-600 flex items-center gap-2 py-1"><Briefcase size={18}/> {employee?.role}</p>
          <p className="text-gray-600 flex items-center gap-2 py-1"><Building2 size={18}/> {employee?.branch?.name || "Chưa gán chi nhánh"}</p>
        </div>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard
          className="bg-gradient-to-r from-green-400 to-green-500"
          icon={<Clock size={32}/>}
          value={employee?.shifts?.length || 0}
          label="Tổng số ca đã làm"
        />
        <StatsCard
          className="bg-gradient-to-r from-blue-400 to-blue-500"
          icon={<CheckCircle size={32}/>}
          value={completedOrders}
          label="Đơn đã hoàn thành"
        />
        <StatsCard
          className="bg-gradient-to-r from-yellow-400 to-yellow-500"
          icon={<ListChecks size={32}/>}
          value={processingOrders}
          label="Đơn đang xử lý"
        />
      </div>

      {/* Ca làm sắp tới */}
      <Card title="Ca làm sắp tới" icon={<Clock size={20} />} color="green">
        {employee?.shifts?.length > 0 ? (
          <ul className="divide-y text-gray-700">
            {employee.shifts.slice(0, 3).map((shift, idx) => (
              <li key={idx} className="py-3 flex justify-between hover:bg-green-50 rounded px-2 transition">
                <span>{new Date(shift.date).toLocaleDateString("vi-VN")}</span>
                <span className="text-sm text-gray-500">{shift.startTime} - {shift.endTime}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Chưa có ca làm nào.</p>
        )}
      </Card>

      {/* Đơn được phân công */}
      <Card title="Đơn được phân công" icon={<ListChecks size={20} />} color="blue">
        {assignedOrders.length > 0 ? (
          <ul className="divide-y text-gray-700">
            {assignedOrders.slice(0, 5).map(order => (
              <li key={order._id} className="py-3 flex justify-between hover:bg-blue-50 rounded px-2 transition">
                <span>Mã đơn: <span className="font-semibold">{order._id}</span></span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium 
                  ${order.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {order.status === "completed" ? "Hoàn thành" : "Đang xử lý"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Không có đơn nào được phân công.</p>
        )}
      </Card>
    </div>
  );
}

// Component thẻ thống kê
function StatsCard({ className, icon, value, label }) {
  return (
    <div className={`text-white p-6 rounded-2xl shadow-lg flex flex-col items-center hover:shadow-2xl transition ${className}`}>
      {icon}
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="opacity-90 text-center">{label}</p>
    </div>
  );
}

// Component card
function Card({ title, icon, color, children }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition">
      <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 text-${color}-600`}>
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}
