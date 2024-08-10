import { Product, Category } from "../models/productModel.js"; // Adjust the path based on your project structure

// Controller function to get all products
export const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database and populate the category field
    const products = await Product.find().populate("category");

    // Send the products as a JSON response
    res.json(products);
  } catch (error) {
    // Handle errors
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function to get a single product by ID
export const getOneProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the product from the database by ID and populate the category and colors fields
    const product = await Product.findById(id)
      .populate("category")
      .populate("colors");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Send the product as a JSON response
    res.json(product);
  } catch (error) {
    // Handle errors
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function to get products by category
export const getCategory = async (req, res) => {
  const { categoryName } = req.params; // Assuming the category name is passed as a URL parameter
  try {
    // Find the category by name
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Fetch all products that belong to the found category
    const products = await Product.find({ category: category._id }).populate(
      "colors"
    );

    // Send the products as a JSON response
    res.json(products);
  } catch (error) {
    // Handle errors
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
