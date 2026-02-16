const  WishlistService = require ("../services/WishlistService.js");

 const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, skuCode } = req.body;

    const wishlist = await WishlistService.addToWishlist(userId, productId, skuCode);
    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    const wishlist = await WishlistService.removeFromWishlist(userId, productId);
    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlist = await WishlistService.getWishlist(userId);
    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {addToWishlist,removeFromWishlist,getWishlist}