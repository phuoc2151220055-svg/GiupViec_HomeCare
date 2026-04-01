import { useEffect, useState } from "react";
import axios from "axios";
import Meta from "../../components/Meta";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Home, Key } from "lucide-react";

export default function LoginService() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form,
        { withCredentials: true }
      );

      const user = res.data.employee;

      // Lưu user vào session
      sessionStorage.setItem("user", JSON.stringify(user));

      // Thông báo đăng nhập thành công
      toast.success(`Đăng nhập thành công ${user.role}`, { duration: 3000 });

      // Redirect theo role
      if (user.role === "admin") navigate("/admin-dashboard", { replace: true });
      else if (user.role === "manager") navigate("/manager-dashboard", { replace: true });
      else navigate("/staff-dashboard", { replace: true });

    } catch (err) {
      // Nếu server trả về lỗi có message, hiển thị, ngược lại thông báo chung
      const message = err.response?.data?.message || "Đăng nhập thất bại! Vui lòng thử lại.";
      toast.error(message, { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  // Nếu user đã login, redirect
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "admin") navigate("/admin-dashboard", { replace: true });
      else if (user.role === "staff") navigate("/staff-dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div
      className="w-screen h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      <Meta title="Đăng nhập dịch vụ dọn nhà" description="Đăng nhập hệ thống" />
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 p-6">
        {/* Hình minh họa */}
        <div className="hidden md:flex flex-col items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2907/2907043.png"
            alt="house cleaning"
            className="w-64 h-64 object-contain animate-fadeIn"
          />
          <p className="mt-4 text-gray-100 text-center max-w-xs font-light">
            Quản lý dịch vụ dọn nhà chuyên nghiệp, nhanh chóng và đáng tin cậy.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-gradient-to-br from-white/80 to-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-80 md:w-96 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-gray-700 mb-8 text-center">
            Đăng nhập hệ thống
          </h2>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
            <div className="flex items-center border border-gray-300 rounded-xl px-4 h-12 focus-within:border-blue-400 transition-colors bg-white/60">
              <Home className="text-gray-400 mr-2" />
              <input
                type="text"
                name="email"
                placeholder="Email hoặc tên đăng nhập"
                value={form.email}
                onChange={handleChange}
                className="outline-none w-full text-gray-700 placeholder-gray-400 bg-transparent"
                required
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-xl px-4 h-12 focus-within:border-blue-400 transition-colors bg-white/60">
              <Key className="text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={form.password}
                onChange={handleChange}
                className="outline-none w-full text-gray-700 placeholder-gray-400 bg-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-green-400 hover:opacity-95 text-white h-12 rounded-xl font-semibold shadow-lg transition-all"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className=" mt-6 text-gray-500 text-sm text-center">
            Dịch vụ dọn nhà chuyên nghiệp - sạch sẽ và nhanh chóng
          </p>
        </div>
      </div>
    </div>
  );
}
