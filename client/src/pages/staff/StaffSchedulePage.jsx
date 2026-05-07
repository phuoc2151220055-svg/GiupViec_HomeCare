import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Upload, X } from "lucide-react";

export default function StaffSchedulePage() {
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [uploadingOrderId, setUploadingOrderId] = useState(null);
  const [selectedImages, setSelectedImages] = useState({});
  const [uploading, setUploading] = useState(false);

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const staffId = user?.id || user?._id || "";

  const getToday = () => new Date().toISOString().split("T")[0];

  const fetchOrders = async (date) => {
    if (!staffId) {
      console.warn("Staff không xác định, không lấy được lịch.");
      setOrders([]);
      return;
    }

    try {
      let url = `http://localhost:5000/api/orders/staff/${staffId}`;
      if (date) url += `?date=${date}`;
      const res = await axios.get(url);
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders failed:", err);
    }
  };

  useEffect(() => {
    if (staffId) {
      const today = getToday();
      setSelectedDate(today);
      fetchOrders(today);
    }
  }, [staffId]);

  useEffect(() => {
    if (staffId && selectedDate) {
      fetchOrders(selectedDate);
    }
  }, [selectedDate, staffId]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const updateData = {
        status: newStatus,
        staffId: staffId,
      };

      if (newStatus === "completed" && selectedImages[orderId]?.length > 0) {
        setUploading(true);
        const uploadedImages = await uploadCompletionImages(orderId, selectedImages[orderId]);
        updateData.completionImages = uploadedImages;
      }

      await axios.patch(`http://localhost:5000/api/orders/${orderId}`, updateData);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );

      if (newStatus === "completed") {
        setSelectedImages((prev) => {
          const updated = { ...prev };
          delete updated[orderId];
          return updated;
        });
        setUploadingOrderId(null);
        toast.success("Cập nhật thành công!");
      }
    } catch (err) {
      console.error("Update status failed:", err);
      toast.error("Lỗi cập nhật!");
    } finally {
      setUploading(false);
    }
  };

  const uploadCompletionImages = async (orderId, files) => {
    const uploadedImages = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        console.log(`Uploading image: ${file.name}`);
        const response = await axios.post(
          `http://localhost:5000/api/orders/${orderId}/upload-completion-image`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        
        console.log("Upload response:", response.data);
        
        if (response.data.url) {
          uploadedImages.push({
            url: response.data.url,
            uploadedAt: new Date(),
          });
          toast.success(`${file.name} tải lên thành công!`);
        }
      } catch (err) {
        console.error(`Image upload failed for ${file.name}:`, err);
        toast.error(`Lỗi tải ${file.name}: ${err.response?.data?.error || err.message}`);
      }
    }

    return uploadedImages;
  };

  const handleImageSelect = (orderId, files) => {
    setSelectedImages((prev) => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), ...Array.from(files)],
    }));
  };

  const removeSelectedImage = (orderId, index) => {
    setSelectedImages((prev) => ({
      ...prev,
      [orderId]: prev[orderId].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        📅 Lịch làm việc của <span className="text-blue-600">{user?.name}</span>
      </h1>

      {/* Bộ lọc ngày */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Chọn ngày:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500 border rounded-lg bg-gray-50">
          Không có lịch làm việc.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow-md rounded-lg p-4 border space-y-3 hover:shadow-lg transition"
            >
              {/* Giờ hẹn */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-blue-600">
                  {order.startTime && order.endTime ? (
                    `${new Date(order.startTime).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} - ${new Date(order.endTime).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  ) : order.endTime ? (
                    new Date(order.endTime).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  ) : order.scheduledAt ? (
                    new Date(order.scheduledAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  ) : (
                    "Chưa đặt giờ"
                  )}
                </span>
                <StatusBadge status={order.status} />
              </div>

              {/* Khách hàng */}
              <div>
                <p className="text-sm text-gray-500">Khách hàng</p>
                <p className="font-medium">{order.customer?.name}</p>
              </div>

              {/* Dịch vụ */}
              <div>
                <p className="text-sm text-gray-500">Dịch vụ</p>
                <p className="font-medium">
                  {order.service?.name}{" "}
                  {order.service?.price && (
                    <span className="text-sm text-gray-500">
                      ({order.service.price.toLocaleString("vi-VN")}đ)
                    </span>
                  )}
                </p>
              </div>

              {/* Chi nhánh */}
              <div>
                <p className="text-sm text-gray-500">Chi nhánh</p>
                <p className="font-medium">{order.branch?.name}</p>
                <p className="text-xs text-gray-500">{order.branch?.address}</p>
              </div>

              {/* Trạng thái (dropdown) */}
              <div>
                <label className="text-sm text-gray-500">Cập nhật trạng thái</label>
                <select
                  value={order.status}
                  onChange={(e) => {
                    if (e.target.value === "completed") {
                      setUploadingOrderId(order._id);
                    } else {
                      updateStatus(order._id, e.target.value);
                    }
                  }}
                  className="w-full mt-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                  disabled={uploading}
                >
                  <option value="assigning">Đang phân công</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="accepted">Đã nhận</option>
                  <option value="in_progress">Đang làm</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="canceled">Đã hủy</option>
                </select>
              </div>

              {/* Image Upload Form */}
              {uploadingOrderId === order._id && order.status !== "completed" && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                  <h4 className="font-semibold text-blue-900">📸 Tải ảnh phòng dọn xong</h4>
                  
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload size={24} className="text-blue-600 mb-1" />
                        <p className="text-sm text-blue-600 font-medium">Nhấn hoặc kéo thả</p>
                        <p className="text-xs text-blue-500">PNG, JPG tối đa 10MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageSelect(order._id, e.target.files)}
                        disabled={uploading}
                      />
                    </label>
                  </div>

                  {selectedImages[order._id]?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Đã chọn {selectedImages[order._id].length} ảnh:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedImages[order._id].map((file, idx) => (
                          <div key={idx} className="relative bg-white p-2 rounded border border-gray-300 flex items-center gap-2">
                            <span className="text-xs text-gray-600 truncate max-w-40">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeSelectedImage(order._id, idx)}
                              className="text-red-500 hover:text-red-700"
                              disabled={uploading}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(order._id, "completed")}
                      disabled={selectedImages[order._id]?.length === 0 || uploading}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 text-sm font-medium"
                    >
                      {uploading ? "Đang tải..." : "Hoàn thành & Lưu"}
                    </button>
                    <button
                      onClick={() => {
                        setUploadingOrderId(null);
                        setSelectedImages((prev) => {
                          const updated = { ...prev };
                          delete updated[order._id];
                          return updated;
                        });
                      }}
                      disabled={uploading}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm font-medium"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    assigning: "bg-gray-100 text-gray-700",
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-blue-100 text-blue-700",
    in_progress: "bg-indigo-100 text-indigo-700",
    completed: "bg-green-100 text-green-700",
    canceled: "bg-red-100 text-red-700",
  };

  const labels = {
    assigning: "Đang phân công",
    pending: "Chờ xử lý",
    accepted: "Đã nhận",
    in_progress: "Đang làm",
    completed: "Hoàn thành",
    canceled: "Đã hủy",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}
