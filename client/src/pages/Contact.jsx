import React, { useState } from "react";
import Meta from "../components/Meta";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Cảm ơn bạn đã gửi liên hệ!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Meta title={"Liên hệ"} />
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-green-500 text-white py-20 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Liên hệ với chúng tôi</h1>
        <p className="text-lg md:text-xl max-w-2xl text-center">
          Nếu bạn có câu hỏi hoặc cần hỗ trợ, vui lòng gửi thông tin cho chúng tôi.
        </p>
      </div>

      <div className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Form liên hệ */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-teal-600">Gửi tin nhắn</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Họ và tên"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff8228]"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff8228]"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Nội dung"
              rows="5"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff8228]"
              required
            />
            <button
              type="submit"
              className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-all"
            >
              Gửi liên hệ
            </button>
          </form>
        </div>

        {/* Thông tin liên hệ + Map */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-teal-600">Thông tin liên hệ</h2>
            <p className="text-gray-600 text-sm mb-2">Hotline: 1800 1234</p>
            <p className="text-gray-600 text-sm mb-2">Email: support@btaskee.com</p>
            <p className="text-gray-600 text-sm mb-2">Địa chỉ: 123 Đường ABC, TP.HCM</p>
          </div>
          <div className="w-full h-64 border rounded-lg overflow-hidden">
            <iframe
              title="Bản đồ"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.123456!2d106.123456!3d10.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z4oCcVHJ1bmcgVGVzdA!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
