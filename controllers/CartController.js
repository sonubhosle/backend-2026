const CartService = require("../services/CartService.js");

// Get Carts
const getUserCart = async (req, res) => {
  try {
    const data = await CartService.findUserCart(req.user._id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Add Item 
const addItemToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "productId required" });
    }

    const data = await CartService.addCartItem(
      req.user._id,
      productId
    );

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Update Quantity
const updateCartItem = async (req, res) => {
  try {
    const item = await CartService.updateCartItemQuantity(
      req.user._id,
      req.params.id,
      req.body.quantity
    );

    res.status(200).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Remove Item
const removeCartItem = async (req, res) => {
  try {
    const result = await CartService.removeCartItem(
      req.user._id,
      req.params.id
    );

    res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  getUserCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
};
