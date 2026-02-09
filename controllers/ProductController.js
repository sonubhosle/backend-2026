const Product_Service = require("../services/ProductService");

/* CREATE */
const createProduct = async (req, res) => {
  try {
    const product = await Product_Service.createProduct(req.body, req.files);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE */
const updateProduct = async (req, res) => {
  try {
    const product = await Product_Service.updateProduct(
      req.params.id,
      req.body,
      req.files
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* GET ALL */
const getAllProducts = async (req, res) => {
  try {
    const products = await Product_Service.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET BY CATEGORY ✅ */
const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product_Service.getProductsByCategory(
      req.params.category
    );
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* FIND BY ID */
const findProductById = async (req, res) => {
  try {
    const product = await Product_Service.findProductById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* DELETE */
const deleteProduct = async (req, res) => {
  try {
    const result = await Product_Service.deleteProduct(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* RELATED */
const getRelatedProducts = async (req, res) => {
  try {
    const products = await Product_Service.getRelatedProducts(req.params.id);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* HOT DEALS */
const getHotDeals = async (req, res) => {
  try {
    const products = await Product_Service.getHotDeals(req.query.limit);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductsByCategory,
  findProductById,
  deleteProduct,
  getRelatedProducts,
  getHotDeals,
};
