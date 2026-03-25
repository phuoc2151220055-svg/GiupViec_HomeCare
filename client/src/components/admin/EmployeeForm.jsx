import { useState, useEffect } from "react";

export default function EmployeeForm({ onSubmit, initialData, branches }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "staff",
    branch: "",
    shifts: [],
  });

  // Load initial data khi edit
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        password: "",
        role: initialData.role || "staff",
        branch: initialData.branch?._id || "", 
        shifts: (initialData.shifts || []).map(s => ({
          date: s.date ? new Date(s.date).toISOString().split("T")[0] : "",
          startTime: s.startTime || "",
          endTime: s.endTime || "",
        })),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleShiftChange = (index, field, value) => {
    const newShifts = [...form.shifts];
    newShifts[index][field] = value;
    setForm({ ...form, shifts: newShifts });
  };

  const addShift = () => {
    setForm({
      ...form,
      shifts: [...form.shifts, { date: "", startTime: "", endTime: "" }],
    });
  };

  const removeShift = (index) => {
    setForm({
      ...form,
      shifts: form.shifts.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { ...form };

    // Xóa password nếu không đổi
    if (!payload.password) delete payload.password;

    // Convert shifts date sang Date object
    payload.shifts = payload.shifts.map((s) => ({
      date: s.date ? new Date(s.date) : null,
      startTime: s.startTime,
      endTime: s.endTime,
    }));

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto bg-white p-6 rounded-xl shadow-md space-y-4 w-full"
    >
      {/* Name */}
      <div>
        <label className="block font-medium mb-1">Tên</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-indigo-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-indigo-500"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block font-medium mb-1">Số điện thoại</label>
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-indigo-500"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block font-medium mb-1">
          Mật khẩu {initialData ? "(để trống nếu không đổi)" : ""}
        </label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-indigo-500"
          placeholder={initialData ? "Nhập password mới nếu muốn đổi" : ""}
          {...(!initialData && { required: true })}
        />
      </div>

      {/* Role */}
      <div>
        <label className="block font-medium mb-1">Vai trò</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-indigo-500"
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="cashier">Cashier</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      {/* Branch */}
      <div>
        <label className="block font-medium mb-1">Chi nhánh</label>
        <select
          name="branch"
          value={form.branch}
          onChange={handleChange}
          className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-indigo-500"
        >
          <option value="">Chọn chi nhánh</option>
          {branches?.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Shifts */}
      <div>
        <label className="block font-medium mb-1">Ca làm việc</label>
        {form.shifts.map((shift, index) => (
          <div key={index} className="flex gap-2 mb-2 items-center">
            <input
              type="date"
              value={shift.date}
              onChange={(e) => handleShiftChange(index, "date", e.target.value)}
              className="border rounded p-1"
            />
            <input
              type="time"
              value={shift.startTime}
              onChange={(e) =>
                handleShiftChange(index, "startTime", e.target.value)
              }
              className="border rounded p-1"
            />
            <input
              type="time"
              value={shift.endTime}
              onChange={(e) =>
                handleShiftChange(index, "endTime", e.target.value)
              }
              className="border rounded p-1"
            />
            <button
              type="button"
              onClick={() => removeShift(index)}
              className="text-red-500 hover:underline font-bold"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addShift}
          className="text-indigo-600 hover:underline mt-1"
        >
          Thêm ca
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
      >
        {initialData ? "Cập nhật nhân viên" : "Thêm nhân viên"}
      </button>
    </form>
  );
}
