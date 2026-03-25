import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 mt-14 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo + Giới thiệu */}
        <div className="flex flex-col gap-4">
          <h1 className="text-teal-600 font-bold text-3xl">HomeCare</h1>
          <p className="text-gray-600 text-sm">
            Btaskee – Dịch vụ dọn nhà, dọn văn phòng và vệ sinh chuyên nghiệp, tiện lợi tại nhà.
          </p>
          <div className="flex gap-3 mt-2">
            <a href="#" className="hover:text-[#ff8228] transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.23 0H1.77C.79 0 0 .78 0 1.75v20.5C0 23.22.79 24 1.77 24h11.06v-9.33H9.69V11.3h3.14V8.77c0-3.1 1.88-4.79 4.63-4.79 1.32 0 2.46.1 2.79.14v3.23h-1.91c-1.5 0-1.79.71-1.79 1.75v2.3h3.57l-.47 3.37h-3.1V24h6.07c.98 0 1.77-.78 1.77-1.75V1.75C24 .78 23.21 0 22.23 0z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-[#ff8228] transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.56c-.88.39-1.83.65-2.83.77a4.93 4.93 0 002.15-2.72 9.86 9.86 0 01-3.12 1.2A4.92 4.92 0 0016.67 3c-2.72 0-4.92 2.2-4.92 4.92 0 .39.04.77.12 1.14C7.69 8.97 4.07 7.09 1.64 4.15a4.92 4.92 0 00-.66 2.47c0 1.7.87 3.2 2.2 4.08a4.92 4.92 0 01-2.23-.62v.06c0 2.38 1.69 4.36 3.94 4.81a4.9 4.9 0 01-2.22.08 4.93 4.93 0 004.6 3.42A9.87 9.87 0 010 19.54a13.94 13.94 0 007.55 2.21c9.05 0 14-7.5 14-14 0-.21 0-.42-.02-.63A10.02 10.02 0 0024 4.56z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-[#ff8228] transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 2.87 8.16 6.84 9.48.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.03 1.54 1.03.9 1.55 2.36 1.1 2.94.84.09-.65.35-1.1.63-1.35-2.22-.25-4.55-1.11-4.55-4.95 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0112 6.85c.85.004 1.7.115 2.5.338 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.66.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .26.18.57.69.48A9.96 9.96 0 0021.96 12c0-5.5-4.46-9.96-9.96-9.96z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Dịch vụ */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-800">Dịch vụ</h3>
          <ul className="flex flex-col gap-2 text-gray-600 text-sm">
            <li><a href="#" className="hover:text-[#ff8228] transition-colors">Dọn nhà theo giờ</a></li>
            <li><a href="#" className="hover:text-[#ff8228] transition-colors">Dọn văn phòng</a></li>
            <li><a href="#" className="hover:text-[#ff8228] transition-colors">Vệ sinh định kỳ</a></li>
            <li><a href="#" className="hover:text-[#ff8228] transition-colors">Dịch vụ khác</a></li>
          </ul>
        </div>

        {/* Hỗ trợ khách hàng */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-800">Hỗ trợ khách hàng</h3>
          <ul className="flex flex-col gap-2 text-gray-600 text-sm">
            <li><a href="#" className="hover:text-[#ff8228] transition-colors">Liên hệ</a></li>
            <li><a href="#" className="hover:text-[#ff8228] transition-colors">Hỏi đáp</a></li>
            <li><a href="#" className="hover:text-[#ff8228] transition-colors">Chính sách đổi trả</a></li>
            <li><a href="#" className="hover:text-[#ff8228] transition-colors">Điều khoản dịch vụ</a></li>
          </ul>
        </div>

        {/* Liên hệ / App */}
        <div>
          <h3 className="font-semibold mb-4 text-gray-800">Liên hệ</h3>
          <p className="text-gray-600 text-sm mb-2">Hotline: 1800 1234</p>
          <p className="text-gray-600 text-sm mb-2">Email: support@btaskee.com</p>
          <p className="text-gray-600 text-sm mb-4">Địa chỉ: 123 Đường ABC, TP.HCM</p>
          <div className="flex gap-2 mt-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10"/>
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/18/App_Store_badge.svg" alt="App Store" className="h-10"/>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 text-gray-500 text-center py-4 text-sm">
        &copy; 2025 Btaskee. All rights reserved.
      </div>
    </footer>
  );
}
