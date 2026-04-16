import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Meta from "../../components/Meta";

export default function BookingSuccess() {
  const navigate = useNavigate();

  return (
    <div className=" bg-gradient-to-br from-green-50 py-10 via-teal-50 to-green-100 flex items-center justify-center px-4">
      <Meta title={"Thanh toán thành công"} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10 text-center animate-fadeIn">
        {/* Icon Success */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <CheckCircle
              size={96}
              className="text-green-500 drop-shadow-md animate-bounce"
            />
            <div className="absolute inset-0 rounded-full bg-green-200 opacity-30 blur-2xl animate-ping"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-800 mb-3">
          🎉 Đặt dịch vụ thành công!
        </h1>
        <p className="text-gray-600 leading-relaxed mb-8">
          Cảm ơn bạn đã tin tưởng sử dụng dịch vụ.  
          Nhân viên sẽ sớm liên hệ xác nhận đơn hàng cho bạn.
        </p>

    
        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-xl shadow-md transition transform hover:scale-105"
          >
            ⬅ Về trang chủ
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="flex-1 bg-gradient-to-r from-teal-500 to-green-500 text-white font-semibold py-3 rounded-xl shadow-md transition transform hover:scale-105"
          >
            Xem đơn hàng ➜
          </button>
        </div>
      </div>
    </div>
  );
}
