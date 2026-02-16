const express = require ("express");
const WishlistController  = require("../controllers/WishlistController.js");
const authenticate = require ("../middleware/Authenticate.js");

const router = express.Router();

router.post("/wishlist/add", authenticate, WishlistController.addToWishlist);

router.delete("/wishlist/:productId", authenticate, WishlistController.removeFromWishlist);

router.get("/wishlist/", authenticate, WishlistController.getWishlist);

module.exports = router;