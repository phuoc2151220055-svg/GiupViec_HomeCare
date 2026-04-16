const mongoose = require("mongoose");
const User = require("../models/UserModel");
const Branch = require("../models/BranchModel");
require("dotenv").config();

async function cleanupEmployees() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/btaskee", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Get Da Nang branch
    const daNangBranch = await Branch.findOne({ name: "Đà Nẵng" });
    if (!daNangBranch) {
      console.log("❌ Da Nang branch not found!");
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`✅ Found Da Nang branch: ${daNangBranch._id}`);

    // Get all employees
    const allEmployees = await User.find();
    console.log(`📋 Total employees found: ${allEmployees.length}`);

    // Count employees by branch
    const employeesInDaNang = await User.countDocuments({ branch: daNangBranch._id });
    const employeesInOtherBranches = await User.countDocuments({ branch: { $ne: daNangBranch._id } });

    console.log(`👥 Employees in Da Nang: ${employeesInDaNang}`);
    console.log(`👥 Employees in other branches: ${employeesInOtherBranches}`);

    // Reassign all employees to Da Nang branch
    if (employeesInOtherBranches > 0) {
      const result = await User.updateMany(
        { branch: { $ne: daNangBranch._id } },
        { branch: daNangBranch._id }
      );
      console.log(`\n✅ Reassigned ${result.modifiedCount} employees to Da Nang`);
    }

    // Verify final state
    const finalCount = await User.countDocuments({ branch: daNangBranch._id });
    console.log(`\n📋 Final employees in Da Nang: ${finalCount}`);

    console.log("\n✅ Done! All employees are now in Da Nang branch.");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

cleanupEmployees();
