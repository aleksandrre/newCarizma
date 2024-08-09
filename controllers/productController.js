import Product from "../models/productModel.js"; // Adjust the path based on your project structure

// Controller function to get all products
export const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    // Send the products as a JSON response
    res.json(products);
  } catch (error) {
    // Handle errors
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getOneProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch all products from the database
    const products = await Product.findById(id);

    // Send the products as a JSON response
    res.json(product);
  } catch (error) {
    // Handle errors
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
