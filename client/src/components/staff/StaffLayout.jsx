import { Outlet } from 'react-router-dom';

export default function StaffLayout() {
  return (
    <div>
      <Outlet /> {/* Outlet để render dashboard hoặc các trang con */}
    </div>
  );
}
