import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { menuStaff } from "../../data";
import HeaderStaff from "./HeaderStaff";
import { FiMenu, FiX } from "react-icons/fi";

export default function StaffLayoutDashboard() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <HeaderStaff onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav
          className={`
            fixed inset-y-0 left-0 z-30 w-60 bg-white border-r border-gray-200 p-4 flex flex-col gap-2
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            sm:translate-x-0 sm:static sm:inset-auto
          `}
        >
          {/* Mobile header in sidebar */}
          <div className="flex justify-between items-center mb-4 sm:hidden">
            <h2 className="font-bold text-lg text-green-700">Menu</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <FiX size={20} />
            </button>
          </div>

          {menuStaff.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 border-l-4 ${
                  active
                    ? "bg-green-100 text-green-700 border-green-500 shadow-sm"
                    : "text-gray-700 border-transparent hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Overlay khi sidebar mở trên mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Nội dung chính */}
        <main className="flex-1 p-6 bg-gray-50 sm:bg-gray-100">
          <Outlet />
        </main>
      </div>

      {/* Nút mở sidebar cho mobile */}
      <button
        className="fixed bottom-4 left-4 z-40 sm:hidden bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        onClick={() => setSidebarOpen(true)}
      >
        <FiMenu size={20} />
      </button>
    </div>
  );
}
