const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema({
 clerkId: { type: String, required: true, unique: true }, // ID từ Clerk
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
