const mongoose = require("mongoose");
const { Schema } = mongoose;

const branchSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  revenue: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Branch", branchSchema);
