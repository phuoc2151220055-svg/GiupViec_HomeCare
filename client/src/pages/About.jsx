import React from "react";
import Meta from "../components/Meta";

export default function About() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Meta title={"Giới thiệu"} />
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-green-500 text-white py-20 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Về HomeCare</h1>
        <p className="text-lg md:text-xl max-w-2xl text-center">
          HomeCare – Dịch vụ dọn nhà và vệ sinh chuyên nghiệp, tiện lợi cho mọi gia đình và văn phòng.
        </p>
      </div>

      {/* Sứ mệnh & Tầm nhìn */}
      <div className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-teal-600">Sứ mệnh</h2>
          <p className="text-gray-700 text-sm md:text-base">
            Chúng tôi cung cấp dịch vụ dọn nhà, vệ sinh định kỳ và dọn văn phòng chất lượng cao,
            giúp cuộc sống của bạn trở nên tiện lợi, gọn gàng và sạch sẽ.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-teal-600">Tầm nhìn</h2>
          <p className="text-gray-700 text-sm md:text-base">
            Trở thành nền tảng dịch vụ vệ sinh và dọn dẹp uy tín hàng đầu Việt Nam,
            mang đến trải nghiệm nhanh chóng và chuyên nghiệp cho mọi khách hàng.
          </p>
        </div>
      </div>

      {/* Giá trị cốt lõi */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center text-teal-600">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Chuyên nghiệp</h3>
              <p className="text-gray-600 text-sm">Đội ngũ nhân viên được đào tạo bài bản, phục vụ tận tâm.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Tiện lợi</h3>
              <p className="text-gray-600 text-sm">Đặt dịch vụ nhanh chóng qua app hoặc website, mọi lúc mọi nơi.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Tin cậy</h3>
              <p className="text-gray-600 text-sm">Cam kết chất lượng, đảm bảo sự hài lòng của khách hàng.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
