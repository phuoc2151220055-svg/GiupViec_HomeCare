const Branch = require("../models/BranchModel");

// Tạo chi nhánh mới
const createBranch = async (req, res) => {
  try {
    const branch = new Branch(req.body);
    const savedBranch = await branch.save();
    res.status(201).json(savedBranch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy tất cả chi nhánh
const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi nhánh theo ID
const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ error: "Branch not found" });
    res.json(branch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật chi nhánh
const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!branch) return res.status(404).json({ error: "Branch not found" });
    res.json(branch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xóa chi nhánh
const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) return res.status(404).json({ error: "Branch not found" });
    res.json({ message: "Branch deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  deleteBranch,updateBranch,getBranchById,getAllBranches,createBranch
}