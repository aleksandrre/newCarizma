import mongoose from "mongoose"; // Use import for ES module syntax

// Define the Category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Category must have a name
    unique: true, // Ensure category names are unique
  },
  description: {
    type: String,
    required: false, // Optional description for the category
  },
  // Optional: An array to hold product IDs that belong to this category
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

// Define the Color schema
const colorSchema = new mongoose.Schema({
  colorName: {
    type: String,
    required: true, // Each color must have a name
  },
  colorPrice: {
    type: Number,
    default: 0, // Default color price is 0
    min: 0, // Color price should be non-negative
  },
  quantity: {
    type: Number,
    required: true, // Quantity must be provided
    min: 0, // Quantity should be non-negative
  },
  sale: {
    type: Number,
    required: true, // Sales percentage must be provided
    min: 0, // Should not be negative
    max: 100, // Should not exceed 100
    default: 0,
  },
  image: {
    type: String,
    required: true, // Each color must have an image
  },
});

// Define the Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Product must have a name
  },
  // Allow multiple categories
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Reference to the Category model
      required: true, // Each product must belong to at least one category
    },
  ],
  description: {
    type: String,
    required: true, // Product must have a description
  },
  images: {
    type: [String], // Array of URLs or paths to product photos
    required: true, // Product must have photos
  },
  mainPrice: {
    type: Number,
    required: true, // Main price must be provided
    min: 0, // Main price should be non-negative
  },
  isNewProduct: {
    type: Boolean,
    default: false, // Default value is false
  },
  sale: {
    type: Number,
    required: true, // Sales percentage must be provided
    min: 0, // Should not be negative
    max: 100, // Should not exceed 100
    default: 0,
  },
  isTopSale: {
    type: Boolean,
    default: false, // Default value is false
  },
  colors: [colorSchema], // Array of color objects
});

// Define a virtual for the newPrice with two decimal places
productSchema.virtual("newPrice").get(function () {
  let price = this.mainPrice;
  if (this.sale > 0) {
    price = this.mainPrice - (this.mainPrice * this.sale) / 100;
  }
  return price.toFixed(2); // Return price with two decimal places
});

// Ensure virtuals are included when converting to JSON
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

// Create the models
export const Category = mongoose.model("Category", categorySchema);
export const Product = mongoose.model("Product", productSchema);
