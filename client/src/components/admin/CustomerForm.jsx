import { useState, useEffect } from "react";

export default function CustomerForm({ onSubmit, initialData }) {
  const [form, setForm] = useState({
    clerkId: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        clerkId: initialData.clerkId || "",
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto bg-white p-6 rounded-xl shadow-md space-y-4 w-full max-w-md">
      <div>
        <label className="block font-medium mb-1">Clerk ID</label>
        <input type="text" name="clerkId" value={form.clerkId} onChange={handleChange} required
          className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-indigo-500" />
      </div>
      <div>
        <label className="block font-medium mb-1">Tên</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} 
          className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-indigo-500" />
      </div>
      <div>
        <label className="block font-medium mb-1">Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} 
          className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-indigo-500" />
      </div>
      <div>
        <label className="block font-medium mb-1">Số điện thoại</label>
        <input type="text" name="phone" value={form.phone} onChange={handleChange} 
          className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-indigo-500" />
      </div>
      <div>
        <label className="block font-medium mb-1">Địa chỉ</label>
        <input type="text" name="address" value={form.address} onChange={handleChange} 
          className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-indigo-500" />
      </div>

      <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
        {initialData ? "Cập nhật khách hàng" : "Thêm khách hàng"}
      </button>
    </form>
  );
}
