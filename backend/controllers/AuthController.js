const User = require("../models/UserModel");
const Branch = require("../models/BranchModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const CustomerModel = require("../models/CustomerModel");

// Tạo nhân viên / Admin / Manager
const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, password, role, branchId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Vui lòng nhập đủ thông tin!" });
    }

    // Kiểm tra email đã tồn tại
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    // Kiểm tra branch có tồn tại không
    let branch = null;
    if (branchId) {
      branch = await Branch.findById(branchId);
      if (!branch) {
        return res.status(400).json({ message: "Chi nhánh không tồn tại!" });
      }
    }

    // KHÔNG hash ở đây nữa, để schema tự hash
    const newUser = new User({
      name,
      email,
      phone,
      password,
      role,
      branch: branch ? branch._id : null,
    });

    await newUser.save();

    res.status(201).json({
      message: "Tạo nhân viên thành công!",
      employee: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        branch: newUser.branch,
      },
    });
  } catch (err) {
    console.error("Error createEmployee:", err);
    res.status(500).json({ message: "Lỗi server khi tạo nhân viên!" });
  }
};

// Đăng nhập nhân viên / Admin / Manager
const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và mật khẩu!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Nhân viên không tồn tại!" });
    }

    // Dùng method từ schema
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không chính xác!" });
    }

    // Tạo JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token,
      employee: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        branch: user.branch,
      },
    });
  } catch (err) {
    console.error("Error loginEmployee:", err);
    res.status(500).json({ message: "Lỗi server khi đăng nhập!" });
  }
};
const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find().populate("branch", "name address");
    // Ẩn password
    const safeEmployees = employees.map(e => {
      const { password, ...rest } = e.toObject();
      return rest;
    });
    res.json(safeEmployees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const syncCustomer = async (req, res) => {
  try {
    const { clerkId, name, email, phone, address } = req.body;

    if (!clerkId) return res.status(400).json({ message: "clerkId required" });

    // Kiểm tra khách đã tồn tại chưa
    let customer = await CustomerModel.findOne({ clerkId });

    if (!customer) {
      // Tạo mới nếu chưa có
      customer = new CustomerModel({ clerkId, name, email, phone, address });
      await customer.save();
    } else {
      // Update thông tin nếu có thay đổi
      customer.name = name || customer.name;
      customer.email = email || customer.email;
      customer.phone = phone || customer.phone;
      customer.address = address || customer.address;
      await customer.save();
    }

    res.status(200).json({ message: "Customer synced", customer });
  } catch (err) {
    console.error("Error syncing customer:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  createEmployee,
  loginEmployee,getAllEmployees,syncCustomer
};
