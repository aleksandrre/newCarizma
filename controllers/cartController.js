import { User } from "../models/usersModel.js"; // Adjust the path based on your project structure

export const getAllCartProducts = async (req, res) => {
  try {
    console.log(req.user);
    const userId = req.user.id; // Assuming you have user information in the request

    // Find the user by ID and populate the product details in the cart
    const user = await User.findById(userId).populate("cart.productId");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate the total price by summing quantity * price for each product in the cart
    const totalPrice = user.cart.reduce((total, cartItem) => {
      const product = cartItem.productId;
      return total + product.price * cartItem.quantity;
    }, 0);

    // Respond with the cart containing product details and the calculated total price
    res.json({
      cart: user.cart,
      totalPrice: totalPrice.toFixed(2), // Adjust the precision as needed
    });
  } catch (error) {
    console.error("Error getting cart products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(productId);
    const userId = req.user.id; // Assuming you have user information in the request

    // Validate that productId is provided
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the product is already in the cart
    const existingProduct = user.cart.find((item) =>
      item.productId.equals(productId)
    );

    if (existingProduct) {
      // If the product is already in the cart, increment the quantity by one
      existingProduct.quantity += 1;
    } else {
      // If the product is not in the cart, add it with a quantity of one
      user.cart.push({
        productId: productId,
        quantity: 1,
      });
    }

    // Save the updated user document
    const updatedUser = await user.save();

    // Populate the product details in the cart
    const populatedUser = await User.populate(updatedUser, {
      path: "cart.productId",
    });

    res.json(populatedUser.cart); // Respond with the updated cart
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const userId = req.user.id; // Assuming you have user information in the request

    // Validate that productId is provided
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the index of the product in the cart
    const productIndex = user.cart.findIndex((item) =>
      item.productId.equals(productId)
    );

    if (productIndex !== -1) {
      // If the product is in the cart, decrease the quantity by one
      if (user.cart[productIndex].quantity > 1) {
        user.cart[productIndex].quantity -= 1;
      } else {
        // If the quantity is already one, remove the product from the cart
        user.cart.splice(productIndex, 1);
      }

      // Save the updated user document
      const updatedUser = await user.save();

      // Populate the product details in the cart
      const populatedUser = await User.populate(updatedUser, {
        path: "cart.productId",
      });

      res.json(populatedUser.cart); // Respond with the updated cart
    } else {
      res.status(404).json({ error: "Product not found in the cart" });
    }
  } catch (error) {
    console.error("Error deleting product from cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteAllFromCart = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user information in the request

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Clear the user's cart
    user.cart = [];

    // Save the updated user document
    const updatedUser = await user.save();

    res.json(updatedUser.cart); // Respond with the empty cart
  } catch (error) {
    console.error("Error deleting all products from cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
