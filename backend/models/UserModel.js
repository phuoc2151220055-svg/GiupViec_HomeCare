const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const ROLES = ["admin", "manager", "staff"];

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    password: { type: String, required: true }, // bắt buộc khi tạo user
    role: { type: String, enum: ROLES, required: true, default: "staff" },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" },
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    shifts: [
      {
        date: { type: Date },
        startTime: { type: String },
        endTime: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Hash password trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// So sánh mật khẩu
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
