import { useState } from "react";

export default function FeedbackPage() {
  const [form, setForm] = useState({
    customerName: "",
    service: "",
    rating: "",
    comment: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Feedback submitted:", form);
    setSubmitted(true);
    setForm({
      customerName: "",
      service: "",
      rating: "",
      comment: "",
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Gửi phản hồi dịch vụ
      </h1>

      {submitted && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700">
          ✅ Cảm ơn bạn đã gửi phản hồi!
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <div>
          <label className="block mb-1 font-medium">Tên khách hàng</label>
          <input
            type="text"
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Nhập tên của bạn"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Dịch vụ</label>
          <input
            type="text"
            name="service"
            value={form.service}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Tên dịch vụ đã sử dụng"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Đánh giá</label>
          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Chọn đánh giá</option>
            <option value="5">⭐⭐⭐⭐⭐ - Rất hài lòng</option>
            <option value="4">⭐⭐⭐⭐ - Hài lòng</option>
            <option value="3">⭐⭐⭐ - Bình thường</option>
            <option value="2">⭐⭐ - Chưa tốt</option>
            <option value="1">⭐ - Tệ</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Phản hồi</label>
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Viết phản hồi của bạn..."
            rows="4"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Gửi phản hồi
        </button>
      </form>
    </div>
  );
}
