const mongoose = require("mongoose");
const { Schema } = mongoose;

const ratingSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  order: { type: Schema.Types.ObjectId, ref: "Order" },
  service: { type: Schema.Types.ObjectId, ref: "Service" },
  rating: { type: Number, min:1, max:5 },
  comment: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Rating", ratingSchema);

