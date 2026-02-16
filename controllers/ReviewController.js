const ReviewService = require ("../services/ReviewService");

const createReview = async (req, res) => {
  try {
    const review = await ReviewService.createReview(req.body, req.user);
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { skuCode } = req.query;

    const reviews = await ReviewService.getAllReviews(productId, skuCode);
    res.status(200).json({ success: true, reviews });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await ReviewService.updateReview(
      req.params.reviewId,
      req.user._id,
      req.body.description
    );
    res.status(200).json({ success: true, review });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const result = await ReviewService.deleteReview(
      req.params.reviewId,
      req.user._id
    );
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports= {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
};