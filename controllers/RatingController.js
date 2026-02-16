const RatingService = require ("../Services/RatingService");

// CREATE

const createRating = async (req, res) => {
  try {
    const rating = await RatingService.createRating(req.body, req.user);

    res.status(201).json({
      success: true,
      data: rating,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// GET ALL
 const getAllRatings = async (req, res) => {
  try {
    const { productId } = req.params;
    const { skuCode } = req.query;

    const ratings = await RatingService.getAllRatings(productId, skuCode);
    res.status(200).json({ success: true, data: ratings });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE
const updateRating = async (req, res) => {
  try {
    const updated = await RatingService.updateRating(
      req.params.ratingId,
      req.user._id,
      req.body.rating
    );
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};




module.exports = {createRating,getAllRatings,updateRating}