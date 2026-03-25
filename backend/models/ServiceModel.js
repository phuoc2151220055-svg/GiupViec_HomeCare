const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const serviceSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    // duration: { type: Number }, // phút
    active: { type: Boolean, default: true },

    // Reviews embedded
    reviews: {
      type: [reviewSchema],
      default: [],
    },

    // stored aggregates (tùy chọn nhưng tiện)
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// helper: recalc average khi cần (có thể gọi từ controller)
serviceSchema.methods.recalculateRating = function () {
  if (!this.reviews || this.reviews.length === 0) {
    this.averageRating = 0;
    this.reviewCount = 0;
  } else {
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.reviewCount = this.reviews.length;
    this.averageRating = Math.round((sum / this.reviewCount) * 10) / 10; // 1 decimal
  }
  return this;
};

module.exports = mongoose.model("Service", serviceSchema);
