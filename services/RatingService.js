

const Rating = require ("../models/Rating.js");
const Product = require ("../models/Product.js");
const User = require ("../models/User.js");

const createRating = async (data, user) => {
  if (!data) throw new Error("Request body missing");

  const { productId, rating } = data;

  if (!productId) throw new Error("productId is required");

  if (!rating || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  // Prevent duplicate rating
  const alreadyRated = await Rating.findOne({
    user: user._id,
    product: productId,
  });

  if (alreadyRated) {
    throw new Error("You have already rated this doctor");
  }

  // Create the rating
  const newRating = await Rating.create({
    user: user._id,
    product: productId,
    rating,
  });

  // 1. Update PRODUCT's ratings
  product.ratings.push(newRating._id);
  product.numRatings = product.ratings.length;
  await product.save();

  // 2. Update USER's ratings (THIS IS MISSING)
  const userDoc = await User.findById(user._id);
  userDoc.ratings.push(newRating._id);
  await userDoc.save();

  // Populate and return
  return await newRating.populate({
    path: "user",
    select: "name surname email photo"
  });
};


const getAllRatings = async (productId, skuCode = null) => {
  const query = { product: productId };
  if (skuCode) query.skuCode = skuCode;

  return Rating.find(query)
    .populate("user", "name surname email photo")
    .sort({ createdAt: -1 });
};

const updateRating = async (ratingId, userId, value) => {
  if (value < 1 || value > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const rating = await Rating.findById(ratingId);
  if (!rating) throw new Error("Rating not found");

  if (rating.user.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  rating.rating = value;
  await rating.save();

  return rating;
};



module.exports = {
  createRating,
  getAllRatings,
  updateRating,
};