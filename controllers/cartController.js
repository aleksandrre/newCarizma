import { User } from "../models/UserModel.js"; // Adjust the path based on your project structure
import { Product } from "../models/productModel.js"; // Adjust the path based on your project structure

// კალათაში არსებული ყველა პროდუქტის წამოღება
export const getAllCartProducts = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: "cart.product",
      select: "name",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "მომხმარებელი ვერ მოიძებნა",
      });
    }

    res.status(200).json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "შეცდომა კალათის პროდუქტების წამოღებისას",
      error: error.message,
    });
  }
};

// კალათაში პროდუქტის დამატება
export const addToCart = async (req, res) => {
  try {
    const { productId, colorId } = req.params;
    const { quantity = 1 } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "პროდუქტი ვერ მოიძებნა",
      });
    }

    let cartItem = {
      product: productId,
      quantity: quantity,
    };

    // ფერიანი პროდუქტის ლოგიკა
    if (product.colors?.length > 0) {
      if (!colorId) {
        return res.status(400).json({
          success: false,
          message: "ფერიანი პროდუქტისთვის აუცილებელია ფერის მითითება",
        });
      }

      const selectedColor = product.colors.id(colorId);
      if (!selectedColor) {
        return res.status(404).json({
          success: false,
          message: "მითითებული ფერი ვერ მოიძებნა",
        });
      }

      if (selectedColor.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: "მითითებული რაოდენობა არ არის მარაგში",
        });
      }

      cartItem = {
        ...cartItem,
        colorId: selectedColor._id,
        colorName: selectedColor.colorName,
        colorImage: selectedColor.image,
        price: selectedColor.colorPrice || product.mainPrice,
        sale: selectedColor.sale || product.sale,
      };
    }
    // უფერო პროდუქტის ლოგიკა
    else {
      if (product.simpleQuantity < quantity) {
        return res.status(400).json({
          success: false,
          message: "მითითებული რაოდენობა არ არის მარაგში",
        });
      }

      cartItem = {
        ...cartItem,
        price: product.mainPrice,
        sale: product.sale,
      };
    }

    // არსებული item-ის შემოწმება კალათაში
    const user = await User.findById(userId);
    const existingItemIndex = user.cart.findIndex((item) => {
      if (colorId) {
        return (
          item.product.toString() === productId &&
          item.colorId?.toString() === colorId
        );
      }
      return item.product.toString() === productId;
    });

    if (existingItemIndex > -1) {
      user.cart[existingItemIndex].quantity += quantity;
      await user.save();
    } else {
      await User.findByIdAndUpdate(userId, {
        $push: { cart: cartItem },
      });
    }

    res.status(200).json({
      success: true,
      message: "პროდუქტი წარმატებით დაემატა კალათაში",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "შეცდომა კალათაში დამატებისას",
      error: error.message,
    });
  }
};

// კონკრეტული პროდუქტის წაშლა კალათიდან
export const deleteFromCart = async (req, res) => {
  try {
    const { productId, colorId } = req.params;
    const userId = req.user._id;

    const updateQuery = colorId
      ? { $pull: { cart: { product: productId, colorId: colorId } } }
      : { $pull: { cart: { product: productId } } };

    const result = await User.updateOne({ _id: userId }, updateQuery);

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "პროდუქტი კალათაში ვერ მოიძებნა",
      });
    }

    res.status(200).json({
      success: true,
      message: "პროდუქტი წარმატებით წაიშალა კალათიდან",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "შეცდომა კალათიდან წაშლისას",
      error: error.message,
    });
  }
};

// კალათის გასუფთავება
export const deleteAllFromCart = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { cart: [] });

    res.status(200).json({
      success: true,
      message: "კალათა წარმატებით გასუფთავდა",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "შეცდომა კალათის გასუფთავებისას",
      error: error.message,
    });
  }
};
