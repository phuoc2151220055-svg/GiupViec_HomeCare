const mongoose = require("mongoose");
const Branch = require("../models/BranchModel");
require("dotenv").config();

async function deleteAllBranchesExceptDaNang() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/btaskee", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Get all branches
    const allBranches = await Branch.find();
    console.log(`📋 Total branches found: ${allBranches.length}`);
    console.log("Current branches:", allBranches.map(b => ({ id: b._id, name: b.name })));

    // Find Da Nang branch
    const daNangBranch = await Branch.findOne({ name: "Đà Nẵng" });

    if (!daNangBranch) {
      console.log("❌ Da Nang branch not found!");
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`\n✅ Found Da Nang branch: ${daNangBranch._id}`);

    // Delete all other branches
    const result = await Branch.deleteMany({ _id: { $ne: daNangBranch._id } });
    console.log(`\n🗑️  Deleted ${result.deletedCount} branch(es)`);

    // Verify remaining branches
    const remainingBranches = await Branch.find();
    console.log(`\n📋 Remaining branches: ${remainingBranches.length}`);
    console.log("Remaining:", remainingBranches.map(b => ({ id: b._id, name: b.name })));

    console.log("\n✅ Done! Only Da Nang branch remains.");
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

deleteAllBranchesExceptDaNang();
