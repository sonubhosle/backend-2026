
const User  = require ("../models/User.js");
const Product  = require ("../models/Product.js");
const mongoose  = require  ("mongoose");

 const addToWishlist = async (userId, productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");



  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Prevent duplicates
  const exists = user.wishlist.some(
    (w) =>
      w.productId.toString() === productId
  );

  if (!exists) {
    user.wishlist.push({ productId });
    await user.save();
  }

  return await getWishlist(userId);
};

const removeFromWishlist = async (userId, productId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.wishlist = user.wishlist.filter((w) => {
    const sameProduct = w.productId.toString() === productId;
    return !(sameProduct);
  });

  await user.save();
  return await getWishlist(userId);
};

const getWishlist = async (userId) => {
  const user = await User.findById(userId).populate("wishlist.productId");
  if (!user) throw new Error("User not found");

  return user.wishlist.map((item) => {
 

    return {
      product: item.productId,
    };
  });
};

module.exports = {addToWishlist,getWishlist,removeFromWishlist}
