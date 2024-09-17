import { Product, Category } from "../models/productModel.js"; // Adjust the path based on your project structure

// Controller function to get all products
export const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find(); // Use .lean() to get plain JS objects

    // Calculate newPrice for each product
    const productsWithNewPrice = products.map((product) => {
      let newPrice = product.mainPrice;
      if (product.sale > 0) {
        newPrice = product.mainPrice - (product.mainPrice * product.sale) / 100;
      }
      // Add newPrice to the product object
      console.log(newPrice);
      return {
        ...product,
        newPrice: newPrice.toFixed(2), // Ensure newPrice is a string with two decimal places
      };
    });

    // Send the products as a JSON response
    res.json(productsWithNewPrice);
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
    // Fetch the product from the database by ID
    const product = await Product.findById(id);

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
