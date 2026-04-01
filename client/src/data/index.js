import { Home, Users, UserCog, Store, ShoppingCart, BarChart2, FileText, Gift,Calendar, ClipboardList  } from "lucide-react";


export const weekDaysLabel = [
"Thứ 2",
"Thứ 3",
"Thứ 4",
"Thứ 5",
"Thứ 6",
"Thứ 7",
"Chủ nhật",
];
export   const scheduleData = {
morning: {
    0: {
    type: "study",
    subject: "Lập trình Web",
    class: "CNTT01",
    period: "Tiết 1-3",
    room: "A101",
    teacher: "Nguyễn Văn B",
    },
    2: {
    type: "exam",
    subject: "Toán rời rạc",
    class: "CNTT02",
    period: "Tiết 1-3",
    room: "Phòng A1",
    teacher: "Trần Văn C",
    },
},
afternoon: {
    1: {
    type: "study",
    subject: "Cơ sở dữ liệu",
    class: "CNTT01",
    period: "Tiết 4-6",
    room: "B202",
    teacher: "Lê Thị D",
    },
    4: {
    type: "study",
    subject: "Mạng máy tính",
    class: "CNTT03",
    period: "Tiết 4-6",
    room: "C303",
    teacher: "Phạm Văn E",
    },
},
};

export   const menuManager = [
    { path: "/manager-dashboard", label: "Trang chủ" },
    { path: "/manager-dashboard/thong-tin", label: "Thông tin chung" },
    { path: "/manager-dashboard/hoc-tap", label: "Học tập" },
    { path: "/manager-dashboard/hoc-phi", label: "Học phí" },
    { path: "/manager-dashboard/dang-ky-hoc-phan", label: "Đăng ký học phần" },
  ];

export const menuStaff = [
  { path: "/staff-dashboard", label: "Trang chủ", icon: "home" },
  { path: "/staff-dashboard/tasks", label: "Đơn phân công", icon: "clipboard-list" }, // Xem các đơn được phân công
  { path: "/staff-dashboard/schedule", label: "Lịch làm việc trong ngày", icon: "calendar" },   // Xem lịch làm việc
  // { path: "/staff-dashboard/feedback", label: "Gửi phản hồi", icon: "message-circle" }, // Báo cáo sự cố / phản hồi nội bộ
  { path: "/staff-dashboard/profile", label: "Thông tin cá nhân", icon: "user" },
];


export const menuAdmin = [
  // Trang chủ
  { path: "/admin-dashboard", label: "Trang chủ", icon: Home },

  // Quản lý người dùng
  {
    label: "Quản lý người dùng",
    children: [
      { path: "/admin-dashboard/customers", label: "Khách hàng", icon: Users },
      { path: "/admin-dashboard/employees", label: "Nhân viên & Quản lý", icon: UserCog },
    ],
  },

  // Quản lý dịch vụ & khuyến mãi
  {
    label: "Quản lý dịch vụ",
    children: [
      { path: "/admin-dashboard/services", label: "Dịch vụ", icon: FileText },
      // { path: "/admin-dashboard/promotions", label: "Khuyến mãi / Voucher", icon: Gift },  
    ],
  },
  {
    label: "Phân công nhân viên",
    children: [
      { path: "/admin-dashboard/assign-shifts", label: "Phân công dịch vụ", icon: Calendar },
      // { path: "/admin-dashboard/assign-orders", label: "Phân công dịch vụ", icon: ClipboardList },
    ],
  },
  // Quản lý đơn hàng
  // { path: "/admin-dashboard/orders", label: "Đơn đặt lịch", icon: ShoppingCart },

  // Quản lý chi nhánh
  { path: "/admin-dashboard/branches", label: "Chi nhánh", icon: Store },

  // Báo cáo & thống kê
  { path: "/admin-dashboard/reports", label: "Báo cáo", icon: BarChart2 },
];


export const heroImages = [
  "https://www.btaskee.com/wp-content/uploads/2021/01/tai-sao-chon-upholstery-cleaning-ver3.png",
  "https://www.btaskee.com/wp-content/uploads/2020/11/home-page-an-tam-voi-lua-chon-cua-ban.png",
  "https://www.btaskee.com/wp-content/uploads/2023/08/office-cleaning-addon-glasses.jpeg",
  "https://www.btaskee.com/wp-content/uploads/2023/08/office-cleaning-addon-vacuuming.jpeg",
];

export const features = [
  {
    title: "Đặt lịch nhanh chóng",
    desc: "Chỉ 60 giây thao tác trên ứng dụng, có ngay người nhận việc.",
    img: "https://www.btaskee.com/wp-content/uploads/2020/11/chon-dich-vu-deep-cleaning.png",
  },
  {
    title: "Giá cả rõ ràng",
    desc: "Giá dịch vụ minh bạch, không phí phát sinh.",
    img: "https://www.btaskee.com/wp-content/uploads/2020/10/cong-tac-vien-.jpg",
  },
  {
    title: "An toàn tối đa",
    desc: "Người làm uy tín, hồ sơ rõ ràng, được công ty giám sát.",
    img: "https://www.btaskee.com/wp-content/uploads/2020/11/chon-dich-vu-ac-cleaning.png",
  },
  {
    title: "Hỗ trợ 24/7",
    desc: "Luôn sẵn sàng giải đáp và hỗ trợ bạn mọi lúc.",
    img: "https://www.btaskee.com/wp-content/uploads/2020/11/chon-dich-vu-laundry.png",
  },
];

export const howItWorks = [
  { step: 1, title: "Chọn dịch vụ", desc: "Chọn dịch vụ phù hợp với nhu cầu của bạn." },
  { step: 2, title: "Đặt lịch", desc: "Chỉ vài giây trên app là có lịch hẹn." },
  { step: 3, title: "Theo dõi & đánh giá", desc: "Theo dõi tiến trình và phản hồi sau khi hoàn thành." },
];

export const services = [
  { title: "Dọn nhà", img: "https://www.btaskee.com/wp-content/uploads/2020/11/chon-dich-vu-deep-cleaning.png" },
  { title: "Giặt ủi", img: "https://www.btaskee.com/wp-content/uploads/2020/11/chon-dich-vu-ac-housekeeping.png" },
  { title: "Rửa xe", img: "https://www.btaskee.com/wp-content/uploads/2023/08/office-cleaning-compare-task.jpeg" },
  { title: "Chăm sóc cây", img: "https://www.btaskee.com/wp-content/uploads/2023/08/office-cleaning-area-lobby.jpeg" },
  { title: "Nấu ăn", img: "https://www.btaskee.com/wp-content/uploads/2023/08/office-cleaning-area-toilet.jpeg" },
  { title: "Vệ sinh văn phòng", img: "https://www.btaskee.com/wp-content/uploads/2023/08/office-cleaning-area-elevator.jpeg" },
];

export const testimonials = [
  { name: "Nguyễn Văn A", text: "Dịch vụ nhanh chóng, nhân viên nhiệt tình.", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Trần Thị B", text: "Mọi thứ minh bạch và uy tín.", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Lê Văn C", text: "Rất hài lòng với dịch vụ!", avatar: "https://randomuser.me/api/portraits/men/56.jpg" },
];

export const faqs = [
  { q: "Ứng dụng triển khai ở đâu?", a: "Hiện tại hơn 20 tỉnh thành và 3 quốc gia Đông Nam Á." },
  { q: "Chất lượng dịch vụ đảm bảo không?", a: "CTV được kiểm tra kỹ và có kinh nghiệm thực tế." },
  { q: "Đăng việc mất bao lâu?", a: "Trong vòng 1 giờ sẽ có người nhận, trừ lễ/giờ cao điểm." },
];