import { Product } from "../models/productModel.js";
import { Category } from "../models/CategoryModel.js";

// Controller function to get all products
export const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database as plain JavaScript objects
    const products = await Product.find().lean();

    // Process products to add `newPrice`
    const productsWithNewPrice = products.map((product) => {
      // Destructure and provide defaults
      const { mainPrice = 0, sale = 0 } = product;

      // Ensure `mainPrice` and `sale` are numbers
      if (typeof mainPrice !== "number" || typeof sale !== "number") {
        console.error(`Invalid data: mainPrice=${mainPrice}, sale=${sale}`);
        return product; // Return the product without modification
      }

      // Calculate new price
      let newPrice = mainPrice;

      if (sale > 0) {
        newPrice = mainPrice - (mainPrice * sale) / 100;
      }

      return {
        ...product,
        newPrice: newPrice.toFixed(2), // Ensure `newPrice` is a string with 2 decimal places
      };
    });

    // Send the modified products as a JSON response
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
    const product = await Product.findById(id).populate("categories");

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
  const { categoryName } = req.params; // Get the category name from URL parameter

  try {
    // Find the category by its name and populate its products in one step
    const category = await Category.findOne({ name: categoryName }).populate(
      "products"
    );

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Send the populated products directly as the response
    res.status(200).json(category.products);
  } catch (error) {
    // Handle errors and send a response
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllCategoryName = async (req, res) => {
  try {
    // Fetch all categories and return only the name field

    const categories = await Category.find({}, "name"); // 'name' selects only the name field

    // If no categories are found, return an appropriate message
    if (categories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    // Return the category names
    res.status(200).json(categories);
  } catch (error) {
    // Handle any errors that occur during the fetch
    res.status(500).json({ message: "Error retrieving category names", error });
  }
};
