const WorkAssignment = require("../models/WorkAssignmentModel");
const UserModel = require("../models/UserModel");
const mongoose = require("mongoose");

// Tạo phân công
const createWorkAssignment = async (req, res) => {
  try {
    const { staff, title, description, startTime, endTime, createdBy, service } = req.body;

    // kiểm tra staff tồn tại
    const staffUser = await UserModel.findById(staff).populate("branch");
    if (!staffUser) return res.status(404).json({ error: "Staff not found" });

    if (!service) return res.status(400).json({ error: "Service is required" });

    // convert createdBy sang ObjectId an toàn
    let createdByObj = null;
    if (createdBy && mongoose.Types.ObjectId.isValid(createdBy)) {
      createdByObj = new mongoose.Types.ObjectId(createdBy);
    }

    const workAssignment = new WorkAssignment({
      staff: staffUser._id,
      branch: staffUser.branch?._id,
      service,
      title,
      description,
      startTime,
      endTime,
      createdBy: createdByObj,
    });

    const savedAssignment = await workAssignment.save();

    const populatedAssignment = await WorkAssignment.findById(savedAssignment._id)
      .populate("staff", "name email")
      .populate("branch", "name address")
      .populate("service", "name price")
      .populate("createdBy", "name email");

    res.status(201).json(populatedAssignment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy tất cả phân công (admin xem)
const getAllWorkAssignments = async (req, res) => {
  try {
    const assignments = await WorkAssignment.find()
      .populate("staff", "name email")
      .populate("branch", "name")
      .populate("service", "name price")
      .populate("createdBy", "name");
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy phân công của 1 nhân viên
const getAssignmentsByStaff = async (req, res) => {
  try {
    const assignments = await WorkAssignment.find({ staff: req.params.staffId })
      .populate("branch", "name")
      .sort({ startTime: 1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật trạng thái công việc
const updateAssignmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await WorkAssignment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Assignment not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// controllers/workAssignmentController.js
const getAssignmentsByStaffAndDate = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { date } = req.query; // YYYY-MM-DD
    console.log(date)
    if (!date) {
      return res.status(400).json({ error: "Date query is required" });
    }

    // so sánh bằng cách convert về chuỗi YYYY-MM-DD
    const assignments = await WorkAssignment.find({ staff: staffId })
      .populate("branch", "name address")
      .populate("service", "name price")
      .lean();

    const filtered = assignments.filter((a) => {
      const assignmentDate = new Date(a.startTime)
        .toISOString()
        .slice(0, 10); // YYYY-MM-DD
      return assignmentDate === date;
    });

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createWorkAssignment,
  getAllWorkAssignments,
  getAssignmentsByStaff,
  updateAssignmentStatus,
  getAssignmentsByStaffAndDate
};
