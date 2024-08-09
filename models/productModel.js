import mongoose from "mongoose";

// Define the product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  isOnSale: {
    type: Boolean,
    required: true,
    default: false,
  },
  salePercentage: {
    type: Number,
    required: true,
    default: 0,
  },
  isNewProduct: {
    required: true,
    type: Boolean,
    default: false,
  },
  color: {
    type: [String],
  },
  variety: {
    type: [String],
  },
  longDescription: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  images: {
    type: [String],
    required: true,
  },

  // Add other fields as needed
});

// Create a Product model based on the schema
const Product = mongoose.model("products", productSchema);

// Export the Product model
export default Product;
