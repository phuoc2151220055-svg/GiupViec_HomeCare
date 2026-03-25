const mongoose = require("mongoose");
const { Schema } = mongoose;

const reportSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: "Order" },
  staff: { type: Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["issue","feedback"] },
  message: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);

