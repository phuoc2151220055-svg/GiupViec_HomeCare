const mongoose = require("mongoose");
const Branch = require("../models/BranchModel");
require("dotenv").config();

async function seedBranches() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/btaskee", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Clear existing branches
    await Branch.deleteMany({});
    console.log("🗑️  Cleared all existing branches");

    // Create Da Nang branch only
    const daNangBranch = new Branch({
      name: "Đà Nẵng",
      address: "Đà Nẵng, Vietnam",
      phone: "0236 3636 636",
    });

    await daNangBranch.save();
    console.log("✅ Created Da Nang branch successfully!");
    console.log(`ID: ${daNangBranch._id}`);
    console.log(`Name: ${daNangBranch.name}`);
    console.log(`Address: ${daNangBranch.address}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedBranches();
