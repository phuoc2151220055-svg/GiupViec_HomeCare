const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    staff: { type: Schema.Types.ObjectId, ref: "User" }, // phân công sau
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" },

    scheduledAt: { type: Date, required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    province: { type: String, required: true },  // Tỉnh/Thành phố
    district: { type: String, required: true },  // Quận/Huyện
    ward: { type: String, required: true },      // Phường/Xã
    detailAddress: { type: String, required: true }, // Số nhà, đường...

    pricingType: {
      type: String,
      enum: ["Theo giờ", "Trọn gói"],
      default: "Theo giờ",
    },

    status: {
      type: String,
      enum: ["assigning", "pending", "accepted", "in_progress", "completed", "canceled"],
      default: "assigning", // mới book mặc định là "đang phân công"
    },
    completedAt: { type: Date },
    price: { type: Number },
    notes: { type: String },
    paymentMethod: { type: String, enum: ["COD", "Thanh toán Momo"], default: "COD" },
    paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    review: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
    staffResponse: {
      type: String,
      enum: ["none", "accepted", "rejected"],
      default: "none",
    },
    responseAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
