import { useEffect, useState } from "react";
import axios from "axios";
import { X, Loader2 } from "lucide-react";

export default function AssignForm({ orderId, onClose, onSuccess }) {
  const [order, setOrder] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [status, setStatus] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [saving, setSaving] = useState(false);

  // 👉 Hàm chuẩn chuyển UTC → local ISO string (không bị lệch)
  const toLocalISOString = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  // 👉 Hàm chuẩn chuyển local → UTC trước khi gửi server
  const toUTCISOString = (localString) => {
    if (!localString) return null;
    const date = new Date(localString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + tzOffset).toISOString();
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (order?.branch?._id) {
      fetchEmployees(order.branch._id, scheduledAt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduledAt, order?.branch?._id]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
      const data = res.data;

      setOrder(data);
      setStaffId(data.staff?._id || "");
      setStatus(data.status || "pending");
      setScheduledAt(toLocalISOString(data.scheduledAt));

      if (data.branch?._id) {
        await fetchEmployees(data.branch._id, data.scheduledAt);
      }
    } catch (err) {
      console.error("❌ Lỗi fetch order:", err);
    }
  };

  const fetchEmployees = async (branchId, scheduledAtInput) => {
    try {
      setLoadingEmployees(true);

      let targetDate = scheduledAtInput || order?.scheduledAt;
      let dateStr = "";

      if (targetDate) {
        // Lấy ngày đúng theo múi giờ Việt Nam (không lệch sang hôm khác)
        const d = new Date(targetDate);
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localDate = new Date(d.getTime() - tzOffset);
        dateStr = localDate.toISOString().slice(0, 10);
      } else {
        const now = new Date();
        const tzOffset = now.getTimezoneOffset() * 60000;
        const localDate = new Date(now.getTime() - tzOffset);
        dateStr = localDate.toISOString().slice(0, 10);
      }

      let list = [];
      try {
        const res = await axios.get(
          `http://localhost:5000/api/employees/branch/${branchId}/availability?date=${dateStr}`
        );
        list = Array.isArray(res.data) ? res.data : [];
      } catch {
        // fallback nếu API availability không có
        const res2 = await axios.get(
          `http://localhost:5000/api/employees/branch/${branchId}`
        );
        list = (res2.data || []).map((e) => ({
          _id: e._id,
          name: e.name,
          busy: false,
        }));
      }

      // Gắn cờ nhân viên đang phụ trách đơn hiện tại
      const withFlags = list.map((e) => ({
        ...e,
        isCurrent: order?.staff?._id === e._id,
      }));

      if (order?.staff && !withFlags.some((e) => e._id === order.staff._id)) {
        withFlags.push({
          _id: order.staff._id,
          name: order.staff.name,
          busy: false,
          isCurrent: true,
        });
      }

      setEmployees(withFlags);
    } catch (err) {
      console.error("❌ Lỗi fetch employees:", err);
      setEmployees([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.patch(`http://localhost:5000/api/orders/${orderId}`, {
        staffId,
        status,
        scheduledAt: toUTCISOString(scheduledAt),
      });

      await fetchOrder();
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("❌ Lỗi update order:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-5 py-3 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700">
            Phân công đơn hàng
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <InfoField label="Khách hàng" value={order.customer?.name} />
          <InfoField label="Dịch vụ" value={order.service?.name} />
          <InfoField label="Chi nhánh" value={order.branch?.name} />

          {/* Thời gian */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Thời gian làm
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Khi thay đổi ngày, hệ thống sẽ kiểm tra lại nhân viên bận/rảnh.
            </p>
          </div>

          {/* Nhân viên */}
          <div>
            <label className="block text-sm font-medium mb-1">Nhân viên</label>

            {loadingEmployees ? (
              <div className="flex items-center justify-center gap-2 border rounded-lg bg-gray-50 p-2 text-gray-600">
                <Loader2 size={16} className="animate-spin" />
                <span>Đang tải danh sách...</span>
              </div>
            ) : (
              <select
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Chưa phân công --</option>
                {employees.map((emp) => {
                  const disabled = emp.busy && !emp.isCurrent;
                  return (
                    <option
                      key={emp._id}
                      value={emp._id}
                      disabled={disabled}
                      className={disabled ? "text-gray-400" : "text-gray-900"}
                    >
                      {emp.name}
                      {emp.isCurrent
                        ? " (Đang phụ trách đơn này)"
                        : emp.busy
                        ? " (Đã được phân công)"
                        : ""}
                    </option>
                  );
                })}
              </select>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Nhân viên có nhãn <i>(Đã được phân công)</i> là đã có lịch làm
              trong ngày và không thể chọn được.
            </p>
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="assigning">Đang phân công</option>
              <option value="pending">Chờ xử lý</option>
              <option value="accepted">Đã nhận</option>
              <option value="in_progress">Đang thực hiện</option>
              <option value="completed">Hoàn thành</option>
              <option value="canceled">Đã hủy</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t px-5 py-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-2 rounded-lg text-white ${
              saving
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <p className="p-2 bg-gray-100 rounded-lg text-gray-800">
        {value || "—"}
      </p>
    </div>
  );
}
