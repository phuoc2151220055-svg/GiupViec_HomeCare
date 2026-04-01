// ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // scroll về đầu trang mỗi khi route thay đổi
  }, [pathname]);

  return children; // giữ các children không thay đổi
}
