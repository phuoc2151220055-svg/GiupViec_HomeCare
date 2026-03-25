import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Sparkles, Clock, ShieldCheck, Star } from "lucide-react";

export default function Service() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/services/getall");
        setServices(res.data);
      } catch (err) {
        console.error("Lỗi khi tải dịch vụ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 animate-pulse text-lg font-medium">
          Đang tải dịch vụ...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-teal-600 to-emerald-500 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.toptal.com/designers/subtlepatterns/patterns/clean-textile.png')] opacity-10"></div>
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight">
            Dịch vụ vệ sinh chuyên nghiệp
          </h1>
          <p className="text-lg mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Tận hưởng không gian sạch sẽ & tiện nghi cùng đội ngũ chuyên nghiệp,
            tận tâm – mang lại sự thoải mái tuyệt đối cho gia đình bạn.
          </p>
          <Link
            to="/contact"
            className="bg-white text-teal-700 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            Liên hệ ngay
          </Link>
        </div>
      </section>

      {/* Danh sách dịch vụ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-14 text-gray-800">
            Dịch vụ của chúng tôi
          </h2>

          {services.length === 0 ? (
            <p className="text-center text-gray-600">Hiện chưa có dịch vụ nào.</p>
          ) : (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Link
                  key={service._id}
                  to={`/service/${service._id}`}
                  className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-transparent hover:border-teal-500 p-8 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Hiệu ứng ánh sáng */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-teal-300 to-emerald-300 transition-all duration-500"></div>

                  {/* Icon */}
                  <div className="bg-teal-100 text-teal-600 p-4 rounded-full mb-6 self-center group-hover:bg-teal-600 group-hover:text-white transition-all duration-500">
                    <Sparkles size={36} />
                  </div>

                  {/* Tên dịch vụ */}
                  <h3 className="text-2xl font-semibold mb-3 text-gray-800 text-center group-hover:text-teal-600 transition-all duration-300">
                    {service.name}
                  </h3>

                  {/* Mô tả */}
                  <p className="text-gray-600 text-sm text-center mb-4 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  {/* Thông tin thêm */}
                  <div className="flex justify-center gap-5 text-gray-500 text-sm mb-4">
                    <span className="flex items-center gap-1">
                      <Clock size={16} /> Nhanh chóng
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={16} /> Uy tín
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={16} /> 5⭐
                    </span>
                  </div>

                  {/* Giá */}
                  <p className="font-bold text-teal-600 text-2xl text-center mb-4">
                    {service.price.toLocaleString()}đ
                  </p>

                  {/* Nút */}
                  <span className="mt-auto mx-auto inline-block bg-teal-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-md hover:bg-teal-700 transition-all duration-300 hover:scale-105">
                    Xem chi tiết
                  </span>

                  {/* Badge nổi bật */}
                  {index % 3 === 0 && (
                    <span className="absolute top-4 right-4 bg-amber-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                      Hot 🔥
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
