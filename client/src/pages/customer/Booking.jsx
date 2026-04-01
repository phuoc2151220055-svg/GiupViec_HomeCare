import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function Booking() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/services/get/${id}`);
        setService(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy dịch vụ:", err);
        setService(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchService();
  }, [id]);

  const handleBooking = () => {
    if (!service) return;
    setMessage(`Đặt dịch vụ "${service.name}" thành công.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-gray-700">
        Đang tải chi tiết dịch vụ...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-gray-700">
        <p className="text-xl">Không tìm thấy dịch vụ.</p>
        <Link to="/" className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg">Về danh sách dịch vụ</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
        <img
          src={service.image || "https://via.placeholder.com/900x350?text=No+Image"}
          alt={service.name}
          className="w-full h-72 object-cover"
        />

        <div className="p-6">
          <h1 className="text-3xl font-bold text-slate-800">{service.name}</h1>
          <p className="mt-2 text-xl font-semibold text-rose-600">{Number(service.price || 0).toLocaleString("vi-VN")}₫</p>
          <div className="mt-4 text-gray-700 whitespace-pre-line">{service.description || "Không có mô tả chi tiết"}</div>

          <button
            onClick={handleBooking}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white py-3 text-lg font-semibold hover:opacity-90"
          >
            Xác nhận đặt dịch vụ
          </button>

          {message && <div className="mt-4 p-3 rounded-lg bg-green-100 text-emerald-800">{message}</div>}

          <div className="mt-4 text-right">
            <Link to="/" className="text-indigo-600 hover:underline">Quay lại danh sách dịch vụ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
