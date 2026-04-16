import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import Meta from "../../components/Meta";

// Đăng ký các plugin Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AdminDashboard() {
  const [stats] = useState({
    products: 120,
    categories: 15,
    suppliers: 8,
    customers: 200,
  });

  // Dữ liệu biểu đồ Bar (Sản phẩm theo danh mục)
  const barData = {
    labels: ["Rau củ quả", "Sữa", "Đồ uống", "Thực phẩm chức năng"],
    datasets: [
      {
        label: "Số lượng sản phẩm",
        data: [40, 25, 35, 20],
        backgroundColor: "#34D399", // Tailwind green-400
      },
    ],
  };

  // Dữ liệu biểu đồ Pie (Khách hàng theo hạng)
  const pieData = {
    labels: ["Normal", "Silver", "Gold", "VIP"],
    datasets: [
      {
        label: "Hạng khách hàng",
        data: [120, 50, 20, 10],
        backgroundColor: ["#D1FAE5", "#6EE7B7", "#10B981", "#047857"], // Tailwind greens
      },
    ],
  };

  return (
    <div className="p-6 flex-1">
      <Meta title="Admin Dashboard" keywords="Admin Dashboard"/>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
          <h3 className="text-gray-500">Products</h3>
          <p className="text-2xl font-bold">{stats.products}</p>
        </div>
        <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
          <h3 className="text-gray-500">Categories</h3>
          <p className="text-2xl font-bold">{stats.categories}</p>
        </div>
        <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
          <h3 className="text-gray-500">Suppliers</h3>
          <p className="text-2xl font-bold">{stats.suppliers}</p>
        </div>
        <div className="bg-white p-6 rounded shadow hover:shadow-lg transition">
          <h3 className="text-gray-500">Customers</h3>
          <p className="text-2xl font-bold">{stats.customers}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Sản phẩm theo danh mục</h2>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Khách hàng theo hạng</h2>
          <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
        </div>
      </div>
    </div>
  );
}
