const express = require ("express");
const router = express.Router();
const admin = require ("../middleware/Admin.js");
const Product_Controller  = require ("../controllers/ProductController.js");
const { uploadProduct } = require ("../config/cloudnary.js");
const authenticate = require('../middleware/Authenticate');

/* ADMIN */
router.post(
  "/product/create",
  authenticate,
  admin("ADMIN"),
  uploadProduct,
  Product_Controller.createProduct
);

router.put(
  "/product/update/:id",
  authenticate,
  admin("ADMIN"),
  uploadProduct,
  Product_Controller.updateProduct
);

router.delete(
  "/product/delete/:id",
  authenticate,
  admin("ADMIN"),
  Product_Controller.deleteProduct
);

/* PUBLIC */
router.get("/products/hot-deals", Product_Controller.getHotDeals);
router.get("/products/category/:category", Product_Controller.getProductsByCategory);
router.get("/products/:id/related", Product_Controller.getRelatedProducts);
router.get("/product/:id", Product_Controller.findProductById);
router.get("/products/", Product_Controller.getAllProducts);

module.exports = router;
