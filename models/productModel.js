const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a product name"],
    triim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a product description"],
  },
  price: {
    type: String,
    required: [true, "Please provide a product price"],
    maxLength: [8, "price cannot exceed 8 characters"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  category: {
    type: String,
    required: [true, "Please provide a product category"],
    enum: [
      "Electronics",
      "Books",
      "Clothing",
      "Home and Kitchen",
      "Beauty and Personal Care",
    ],
  },
  stock: {
    type: Number,
    required: [true, "Please provide a product stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Product", ProductSchema);
