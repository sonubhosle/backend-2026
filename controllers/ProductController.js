const Product_Service = require("../services/ProductService.js");

/* CREATE */
const createProduct = async (req, res) => {
  try {
    const product = await Product_Service.createProduct(
      req.body,
      req.files
    );

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProduct };
