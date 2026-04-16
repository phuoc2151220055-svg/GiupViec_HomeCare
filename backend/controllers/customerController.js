const Customer = require("../models/CustomerModel");

// Thêm khách hàng mới
const createCustomer = async (req, res) => {
  try {
    const { clerkId, name, email, phone, address } = req.body;

    const exist = await Customer.findOne({ clerkId });
    if (exist) return res.status(400).json({ message: "Clerk ID đã tồn tại" });

    const customer = await Customer.create({ clerkId, name, email, phone, address, avatarUrl });
    res.status(201).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy danh sách khách hàng
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy khách hàng theo ID
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Cập nhật khách hàng
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Xóa khách hàng
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};


module.exports = {
  deleteCustomer,updateCustomer,getCustomerById,getAllCustomers,createCustomer
}