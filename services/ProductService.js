const Product = require ("../models/Product.js");
const { generateProductSku, generateSkuCode } = require ("../utils/generateSku.js");

/* ---------- CREATE PRODUCT ---------- */
const createProduct = async (reqData, files) => {
  const file = files?.[0];
  if (!file?.path) throw new Error("Product image required");

  // Auto generate SKU ONLY for main product
  const productSku = generateProductSku(reqData.title, reqData.brand);

  // Price & discount calculation
  const price = Number(reqData.price);
  const discountedPrice =
    Number(reqData.discountedPrice) ?? price;

  const discount =
    reqData.discount ??
    Math.round(((price - discountedPrice) / price) * 100);

  const product = new Product({
    productSku,
    title: reqData.title,
    brand: reqData.brand,
    category: reqData.category,
    description: reqData.description,
    image: file.path,
    price,
    discountedPrice,
    discount,
    tag: reqData.tag,
    offers: reqData.offers ? JSON.parse(reqData.offers) : [],
  });

  return await product.save();
};



/* ---------- GET ALL PRODUCTS ---------- */
const getAllProducts = async () => {
  return await Product.find().populate("ratings").populate("reviews");
};

/* ---------- FIND PRODUCT BY ID ---------- */
const findProductById = async (id) => {
  const product = await Product.findById(id).populate("ratings").populate("reviews");

  if (!product) throw new Error("Product not found");
  return product;
};

/* ---------- DELETE PRODUCT ---------- */
const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  await Product.findByIdAndDelete(id);
  return { message: "Product deleted successfully" };
};

/* ---------- RELATED PRODUCTS ---------- */
const getRelatedProducts = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  return await Product.find({
    _id: { $ne: id },
    category: product.category,
    brand: product.brand,
  }).limit(8);
};


const updateProduct = async (productId, reqData, files) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  // If a new image is uploaded, update it
  if (files?.[0]?.path) {
    product.image = files[0].path;
  }

  // Update basic fields if provided
  product.title = reqData.title ?? product.title;
  product.brand = reqData.brand ?? product.brand;
   product.tag = reqData.tag ?? product.tag;
  product.category = reqData.category ?? product.category;
  product.description = reqData.description ?? product.description;

  // Update top-level prices if provided
  product.price = reqData.price ?? product.price;
  product.discountedPrice = reqData.discountedPrice ?? product.discountedPrice;
  product.discount = reqData.discount ?? product.discount;

  // Update offers
  if (reqData.offers) {
    product.offers = JSON.parse(reqData.offers);
  }

  // Update SKUs if provided
  if (reqData.skus) {
    const skus = JSON.parse(reqData.skus);
    const updatedSkus = skus.map((s) => {
      const discountedPrice = s.discountedPrice ?? s.price;
      const discount =
        s.discount ??
        Math.round(((s.price - discountedPrice) / s.price) * 100);

      return {
        ...s,
        skuCode: generateSkuCode(product.productSku, s.weight),
        discountedPrice,
        discount,
      };
    });
    product.skus = updatedSkus;
  }

  return await product.save();
};
const getHotDeals = async (limit = 10) => {
  return await Product.find({
    discount: { $gt: 0 } // only discounted products
  })
    .sort({ discount: -1 }) // highest discount first
    .limit(Number(limit))
    .select(
      "title brand category image price discountedPrice discount skus"
    );
};

module.exports = {
  createProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  deleteProduct,
  getRelatedProducts,
  getHotDeals
};