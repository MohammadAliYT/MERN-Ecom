const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const PriceRangeSchema = new mongoose.Schema({
  minQuantity: {
    type: Number,
    required: true,
    min: [1, "Minimum Quanity must be greater than or equal to 1"],
  },
  maxQuantity: {
    type: Number,
    required: true,
    min: [0, "Maximum Quanity must be greater than or equal to 0"],
  },
  price: {
    type: Number,
    required: true,
    min: [1, "Price must be greater than or equal to 1"],
  },
});

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a product name"],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a product description"],
  },
  priceRange: [PriceRangeSchema],
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
    default: 1,
    validate: {
      validator: function (value) {
        return typeof value === "number" && value >= 0;
      },
      message: "Stock must be greater than zero",
    },
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ProductSchema.plugin(uniqueValidator, {
  message: "Error, {PATH} {VALUE} already exists.",
});

module.exports = mongoose.model("Product", ProductSchema);
