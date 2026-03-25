const Employee = require("../models/UserModel");
const Order = require("../models/OrderModel");
const WorkAssignment  = require("../models/WorkAssignmentModel");

// Tạo nhân viên mới
const createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    const savedEmployee = await employee.save();
    // Ẩn password khi trả về client
    const { password, ...rest } = savedEmployee.toObject();
    res.status(201).json(rest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy tất cả nhân viên
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate("branch", "name address");
    console.log("a",employees)
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

// Lấy nhân viên theo ID
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate("branch", "name address");
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    const { password, ...rest } = employee.toObject();
    res.json(rest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật nhân viên
const updateEmployee = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      const bcrypt = require("bcrypt");
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      // nếu password không được truyền hoặc rỗng thì không cập nhật password
      delete updateData.password;
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("branch", "name address");

    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const { password, ...rest } = employee.toObject();
    res.json(rest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Xóa nhân viên
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy nhân viên theo chi nhánh
const getEmployeesByBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const employees = await Employee.find({ branch: branchId }).populate(
      "branch",
      "name address"
    );

    const safeEmployees = employees.map((e) => {
      const { password, ...rest } = e.toObject();
      return rest;
    });

    res.json(safeEmployees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getBranchOrder = async (req, res) => {
  try {
    const employees = await Employee.find({ branch: req.params.branchId });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
const getEmployeesByBranchWithStatus = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { date } = req.query; // YYYY-MM-DD

    const employees = await Employee.find({ branch: branchId, role: "staff" });

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const result = await Promise.all(
      employees.map(async (emp) => {
        const hasOrder = await Order.exists({
          staff: emp._id,
          scheduledAt: { $gte: start, $lte: end },
          status: { $nin: ["completed", "canceled"] },
        });

        const hasAssignment = await WorkAssignment.exists({
          staff: emp._id,
          startTime: { $lte: end },
          endTime: { $gte: start },
          status: { $nin: ["completed", "canceled"] },
        });

        return {
          _id: emp._id,
          name: emp.name,
          email: emp.email,
          phone: emp.phone,
          busy: Boolean(hasOrder || hasAssignment),
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  deleteEmployee,updateEmployee,getEmployeeById,getAllEmployees,createEmployee,getEmployeesByBranch,getBranchOrder,getEmployeesByBranchWithStatus
}
