import { Outlet, Link, useLocation } from "react-router-dom";
import { menuAdmin } from "../../data/index";
import HeaderAdmin from "./HeaderAdmin";
import { useState } from "react";

export default function AdminLayoutDashboard() {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (index) => {
    setOpenMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <HeaderAdmin />

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-md p-4 flex flex-col gap-2">
          {menuAdmin.map((item, index) => {
            if (item.icon) {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 border-l-4 ${
                    isActive(item.path)
                      ? "bg-green-100 text-green-700 border-green-500 shadow-sm"
                      : "text-gray-700 border-transparent hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            }

            if (item.children) {
              const open = openMenus[index] || false;
              return (
                <div key={index} className="flex flex-col mb-2">
                  <button
                    onClick={() => toggleMenu(index)}
                    className="flex justify-between items-center w-full px-4 py-2 text-gray-700 font-semibold rounded-xl hover:bg-green-50 hover:text-green-600 transition-all shadow-sm"
                  >
                    <span>{item.label}</span>
                    <span
                      className={`transform transition-transform duration-200 ${
                        open ? "rotate-90 text-green-500" : ""
                      }`}
                    >
                      &#9654;
                    </span>
                  </button>
                  {open && (
                    <div className="flex flex-col ml-4 mt-1">
                      {item.children.map((child, idx) => {
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={idx}
                            to={child.path}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                              isActive(child.path)
                                ? "bg-green-100 text-green-700 shadow-sm"
                                : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                            }`}
                          >
                            {ChildIcon && <ChildIcon size={16} />}
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
        </nav>

        {/* Nội dung chính */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
