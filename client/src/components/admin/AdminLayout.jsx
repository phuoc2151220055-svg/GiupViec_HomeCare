import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div>
      <Outlet /> {/* Outlet để render dashboard hoặc các trang con */}
    </div>
  );
}
