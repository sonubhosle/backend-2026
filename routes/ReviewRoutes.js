const express = require ("express");
const authenticate = require ("../middleware/Authenticate.js");
const ReviewController = require ("../controllers/ReviewController.js");

const router = express.Router();

// Create review
router.post("/review/create", authenticate, ReviewController.createReview);

router.get("/reviews/all/:productId", ReviewController.getAllReviews);

// Update review
router.put("/review/update/:reviewId", authenticate, ReviewController.updateReview);

// Delete review
router.delete("/review/delete/:reviewId", authenticate, ReviewController.deleteReview);

module.exports = router;