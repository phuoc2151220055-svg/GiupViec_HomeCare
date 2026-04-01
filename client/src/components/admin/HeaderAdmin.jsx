import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { User, LogOut, Home  } from "lucide-react";

export default function HeaderService() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/manager-login");
  };

  return (
    <header className="bg-gradient-to-r from-green-400 to-blue-400 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/admin-dashboard" className="flex items-center gap-2">
          <Home  size={28} className="text-white" />
          <h2 className="text-2xl sm:text-3xl font-bold">CleanService</h2>
          <span className="hidden sm:inline text-white/80 font-medium">Quản lý</span>
        </Link>

        {/* User dropdown */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition shadow-sm backdrop-blur"
            >
              <img
                src={
                  user.imageUrl ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50"
                }
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
              <span className="font-semibold">{user.name}</span>
            </button>

            {open && (
              <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-800 border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-fade-in">
                <li>
                  <Link
                    to="/admin-dashboard/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition"
                  >
                    <User size={18} className="text-green-500" /> Hồ sơ
                  </Link>
                </li>
                <li
                  className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer transition text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut size={18} /> Đăng xuất
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
