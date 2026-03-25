const mongoose = require("mongoose");
const { Schema } = mongoose;

const workAssignmentSchema = new Schema(
  {
    staff: { type: Schema.Types.ObjectId, ref: "User", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" },
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    title: { type: String, required: true }, // ví dụ: trực quầy, vệ sinh kho
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["assigned", "in_progress", "completed", "canceled"],
      default: "assigned",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // admin/manager
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkAssignment", workAssignmentSchema);
