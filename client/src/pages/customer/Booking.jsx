import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import Meta from "../../components/Meta";
import {
  MapPin,
  Calendar,
  Clock,
  FileText,
  CreditCard,
  CheckCircle2,
  Home,
  DollarSign,
  UserCheck,
} from "lucide-react";

export default function Booking() {
  const { id } = useParams(); // serviceId
  const navigate = useNavigate();
  const { user } = useUser();

  const [service, setService] = useState(null);
  const [branches, setBranches] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");

  const [formData, setFormData] = useState({
    branch: "",
    scheduledAt: "",
    startTime: "",
    endTime: "",
    detailAddress: "",
    notes: "",
    pricingType: "Theo giờ",
    paymentMethod: "COD",
  });

  // ==== ĐỊA CHỈ ====
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // ===== LẤY DỊCH VỤ =====
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/services/get/${id}`)
      .then((res) => setService(res.data))
      .catch((err) => console.error("Lỗi khi tải dịch vụ:", err));
  }, [id]);

  // ===== LẤY CHI NHÁNH =====
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/branches/getall")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.branches || [];
        setBranches(data);
      })
      .catch((err) => console.error("Lỗi khi tải chi nhánh:", err));
  }, []);

  // ===== LẤY NHÂN VIÊN =====
  useEffect(() => {
    if (!formData.branch || !id) return;
    axios
      .get(
        `http://localhost:5000/api/employees/by-branch-and-service/${formData.branch}/${id}`
      )
      .then((res) => setStaffs(res.data || []))
      .catch((err) => console.error("Lỗi khi tải danh sách nhân viên:", err));
  }, [formData.branch, id]);

  // ===== LẤY TỈNH/THÀNH =====
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("Lỗi khi tải tỉnh/thành:", err));
  }, []);

  // ===== LẤY QUẬN/HUYỆN =====
  useEffect(() => {
    if (!selectedProvince) return;
    axios
      .get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
      .then((res) => setDistricts(res.data.districts || []))
      .catch((err) => console.error("Lỗi khi tải quận/huyện:", err));
  }, [selectedProvince]);

  // ===== LẤY PHƯỜNG/XÃ =====
  useEffect(() => {
    if (!selectedDistrict) return;
    axios
      .get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
      .then((res) => setWards(res.data.wards || []))
      .catch((err) => console.error("Lỗi khi tải phường/xã:", err));
  }, [selectedDistrict]);

  // ===== ĐỒNG BỘ CLERK → CUSTOMER =====
  useEffect(() => {
    if (user) {
      axios
        .post("http://localhost:5000/api/auth/sync", {
          clerkId: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          phone: user.primaryPhoneNumber?.phoneNumber,
        })
        .then((res) => {
          localStorage.setItem("customerId", res.data.customer._id);
        })
        .catch((err) => console.error("Sync customer failed:", err));
    }
  }, [user]);

  // ===== HANDLE INPUT =====
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Vui lòng đăng nhập trước khi đặt dịch vụ!");

    const customerId = localStorage.getItem("customerId");
    if (!customerId) return toast.error("Không tìm thấy thông tin khách hàng!");
    if (
      !formData.branch ||
      !formData.scheduledAt ||
      !formData.detailAddress ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard
    )
      return toast.error("Vui lòng điền đầy đủ thông tin địa chỉ!");

    try {
      const DEFAULT_HOURLY_RATE = 150000;
      const packageDiscount = 0.2;
      const packageHours = 5;

      const hourlyRate = service?.price || DEFAULT_HOURLY_RATE;
      let total = 0;
      let start = null;
      let end = null;

      if (formData.pricingType === "Theo giờ") {
        if (!formData.startTime || !formData.endTime) {
          return toast.error("Vui lòng chọn giờ bắt đầu và kết thúc cho dịch vụ theo giờ!");
        }

        start = new Date(`${formData.scheduledAt}T${formData.startTime}`);
        end = new Date(`${formData.scheduledAt}T${formData.endTime}`);
        const diffHours = (end - start) / (1000 * 60 * 60);

        if (diffHours <= 0) {
          return toast.error("Giờ kết thúc phải sau giờ bắt đầu.");
        }

        total = diffHours * hourlyRate;
      } else {
        if (!formData.startTime) {
          return toast.error("Vui lòng chọn giờ bắt đầu cho gói trọn gói!");
        }

        start = new Date(`${formData.scheduledAt}T${formData.startTime}`);
        end = new Date(start.getTime() + packageHours * 60 * 60 * 1000);

        total = Math.round(packageHours * hourlyRate * (1 - packageDiscount));
      }

      const provinceObj = provinces.find(
        (p) => p.code === parseInt(selectedProvince)
      );
      const districtObj = districts.find(
        (d) => d.code === parseInt(selectedDistrict)
      );
      const wardObj = wards.find((w) => w.code === parseInt(selectedWard));

      // Gửi đúng 4 trường theo model mới
      const scheduledDateTime = start || new Date(`${formData.scheduledAt}T00:00`);

      const payload = {
        customer: customerId,
        service: id,
        branch: formData.branch,
        province: provinceObj?.name || "",
        district: districtObj?.name || "",
        ward: wardObj?.name || "",
        detailAddress: formData.detailAddress,
        notes: formData.notes,
        pricingType: formData.pricingType,
        scheduledAt: scheduledDateTime,
        startTime: start,
        endTime: end,
        price: total,
        paymentMethod: formData.paymentMethod,
        paymentStatus: "unpaid",
        staff: selectedStaff || null,
      };

      if (formData.paymentMethod === "COD") {
        await axios.post("http://localhost:5000/api/orders", payload);
        toast.success("Đặt dịch vụ thành công!");
        navigate("/orders-susscess");
      } else {
        const res = await axios.post("http://localhost:5000/api/momo/create", {
          amount: total,
          orderInfo: `Thanh toán dịch vụ: ${service.name}`,
          ...payload,
        });
        if (res.data.payUrl) window.location.href = res.data.payUrl;
      }
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi đặt dịch vụ!");
    }
  };

  if (!service)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 animate-pulse">
        Đang tải dịch vụ...
      </div>
    );

  const hourlyRate = service?.price || 150000;
  const packageHours = 5;
  const packagePrice = Math.round(packageHours * hourlyRate * 0.8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 font-sans">
      <Meta title={`Đặt dịch vụ ${service.name}`} />

      {/* HEADER */}
      <section className="text-center py-20 bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-lg">
        <h1 className="text-5xl font-extrabold mb-3">
          Đặt dịch vụ: {service.name}
        </h1>
        <p className="opacity-90 max-w-2xl mx-auto">
          {service.description || "Dịch vụ chất lượng, nhanh chóng & tận tâm."}
        </p>
      </section>

      {/* FORM */}
      <div className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-teal-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
            <CheckCircle2 className="text-teal-600" /> Thông tin đặt dịch vụ
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* CHI NHÁNH */}
            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                <MapPin className="text-teal-600" /> Chi nhánh
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="">-- Chọn chi nhánh --</option>
                {branches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name} - {b.address}
                  </option>
                ))}
              </select>
            </div>

            {/* NHÂN VIÊN */}
            {staffs.length > 0 && (
              <div>
                <label className="block font-medium mb-2 flex items-center gap-2">
                  <UserCheck className="text-teal-600" /> Nhân viên yêu thích
                </label>
                <select
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">-- Không chọn --</option>
                  {staffs.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* NGÀY ĐẶT */}
            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                <Calendar className="text-teal-600" /> Ngày đặt dịch vụ
              </label>
              <input
                type="date"
                name="scheduledAt"
                value={formData.scheduledAt}
                onChange={handleChange}
                required
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* LOẠI GIÁ */}
            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                <DollarSign className="text-teal-600" /> Loại tính giá
              </label>
              <select
                name="pricingType"
                value={formData.pricingType}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="Theo giờ">Theo giờ</option>
                <option value="Trọn gói">Trọn gói</option>
              </select>
            </div>

            {/* GIỜ */}
            {formData.pricingType === "Theo giờ" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2 flex items-center gap-2">
                    <Clock className="text-teal-600" /> Giờ bắt đầu
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2 flex items-center gap-2">
                    <Clock className="text-teal-600" /> Giờ kết thúc
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}

            {formData.pricingType === "Trọn gói" && (
              <div>
                <label className="block font-medium mb-2 flex items-center gap-2">
                  <Clock className="text-teal-600" /> Giờ bắt đầu (5h dịch vụ)
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Trọn gói mặc định 5 tiếng; hệ thống sẽ tự tính giờ kết thúc.
                </p>
              </div>
            )}

            {/* ĐỊA CHỈ */}
            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                <Home className="text-teal-600" /> Địa chỉ
              </label>

              {/* TỈNH */}
              <select
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setSelectedDistrict("");
                  setSelectedWard("");
                }}
                required
                className="w-full border px-4 py-3 rounded-lg mb-4 focus:ring-2 focus:ring-teal-500"
              >
                <option value="">-- Chọn tỉnh/thành phố --</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>

              {/* QUẬN */}
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedWard("");
                }}
                required
                className="w-full border px-4 py-3 rounded-lg mb-4 focus:ring-2 focus:ring-teal-500"
              >
                <option value="">-- Chọn quận/huyện --</option>
                {districts.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>

              {/* PHƯỜNG */}
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                required
                className="w-full border px-4 py-3 rounded-lg mb-4 focus:ring-2 focus:ring-teal-500"
              >
                <option value="">-- Chọn phường/xã --</option>
                {wards.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.name}
                  </option>
                ))}
              </select>

              {/* ĐỊA CHỈ CỤ THỂ */}
              <input
                type="text"
                name="detailAddress"
                value={formData.detailAddress}
                onChange={handleChange}
                required
                placeholder="Ví dụ: 123 Nguyễn Văn Linh, nhà số 5"
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* GHI CHÚ */}
            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                <FileText className="text-teal-600" /> Ghi chú
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Ví dụ: Yêu cầu mang dụng cụ vệ sinh..."
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* THANH TOÁN */}
            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                <CreditCard className="text-teal-600" /> Hình thức thanh toán
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="COD">Thanh toán khi hoàn thành (COD)</option>
                <option value="Thanh toán Momo">Thanh toán qua MoMo</option>
              </select>
            </div>

            {/* NÚT */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
            >
              Xác nhận đặt dịch vụ
            </button>
          </form>
        </div>

        {/* THÔNG TIN DỊCH VỤ */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-teal-100">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Thông tin dịch vụ
          </h3>
          <p className="text-gray-700 font-medium mb-2">{service.name}</p>
          <p className="text-gray-600 mb-4">
            {service.description || "Dịch vụ hiện chưa có mô tả chi tiết."}
          </p>

          <div className="flex flex-col gap-2 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Giá theo giờ:</span>
              <span className="text-teal-600 font-bold">{hourlyRate.toLocaleString()} đ/giờ</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Giá trọn gói (5 tiếng):</span>
              <span className="text-teal-600 font-bold">
                {packagePrice.toLocaleString()} đ (giảm 20% so với {(hourlyRate * 5).toLocaleString()} đ)
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate("/services")}
            className="w-full border border-teal-500 text-teal-600 py-3 rounded-xl hover:bg-teal-50 transition"
          >
            ← Quay lại danh sách dịch vụ
          </button>
        </div>
      </div>
    </div>
  );
}
