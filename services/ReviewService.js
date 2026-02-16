const Review = require ("../models/Review.js");
const Product = require ("../models/Product.js");
const User = require ("../models/User.js")


const createReview = async (data, user) => {
  if (!data) throw new Error("Request body missing");

  const { productId, description } = data;

  if (!productId) throw new Error("productId is required");

  if (!description || description.trim() === "") {
    throw new Error("Review description is required");
  }

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  // Optional: prevent duplicate review per product
  const alreadyReviewed = await Review.findOne({
    user: user._id,
    product: productId,
  });

  if (alreadyReviewed) {
    throw new Error("You have already reviewed this product");
  }

  // Create review
  const review = await Review.create({
    user: user._id,
    product: product._id,
    description,
  });

  // 1️⃣ Push into PRODUCT
  product.reviews.push(review._id);
  product.numReviews = product.reviews.length;
  await product.save();

  // 2️⃣ Push into USER (store in user document)
  await User.findByIdAndUpdate(user._id, {
    $push: { reviews: review._id },
  });

  // 3️⃣ Populate user info before returning
  return await review.populate({
    path: "user",
    select: "name surname email photo",
  });
};

const getAllReviews = async (productId) => {
  const query = { product: productId };

  return Review.find(query)
    .populate("user", "name surname email photo")
    .sort({ createdAt: -1 });
};

const updateReview = async (reviewId, userId, description) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");

  if (review.user.toString() !== userId.toString())
    throw new Error("Unauthorized");

  review.description = description ?? review.description;
  await review.save();

  return review.populate("user", "name email");
};

const deleteReview = async (reviewId, userId) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");

  if (review.user.toString() !== userId.toString())
    throw new Error("Unauthorized");

  await Product.findByIdAndUpdate(review.product, {
    $pull: { reviews: review._id },
    $inc: { numReviews: -1 },
  });

  await User.findByIdAndUpdate(userId, {
    $pull: { reviews: review._id },
  });

  await Review.findByIdAndDelete(reviewId);
  return { message: "Review deleted successfully" };
};

module.exports =  {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
};
