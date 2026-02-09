const Cart = require("../models/Cart");
const Product = require("../models/Product");
const CartItem = require("../models/CartItems");

/* CREATE OR GET USER CART */
const createCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      totalPrice: 0,
      totalPayable: 0,
      totalItem: 0,
      discount: 0,
    });
  }
  return cart;
};

/* UPDATE CART TOTALS */
const updateCartTotals = async (cartId) => {
  const items = await CartItem.find({ cart: cartId });

  let totalPrice = 0;
  let totalPayable = 0;
  let totalItem = 0;
  let discount = 0;

  items.forEach((item) => {
    totalPrice += item.price;
    totalPayable += item.discountedPrice;
    totalItem += item.quantity;
    discount += item.discount;
  });

  await Cart.findByIdAndUpdate(cartId, {
    totalPrice,
    totalPayable,
    totalItem,
    discount,
  });
};

/* FIND USER CART */
const findUserCart = async (userId) => {
  const cart = await createCart(userId);

  const items = await CartItem.find({ cart: cart._id })
    .populate(
      "product",
      "title brand image price discountedPrice productSku"
    );

  return { cart, items };
};

/* ADD ITEM TO CART */
const addCartItem = async (userId, productId) => {
  const cart = await createCart(userId);

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  const existingItem = await CartItem.findOne({
    cart: cart._id,
    product: product._id,
  });

  if (existingItem) {
    existingItem.quantity += 1;
    existingItem.price = product.price * existingItem.quantity;
    existingItem.discountedPrice =
      product.discountedPrice * existingItem.quantity;
    existingItem.discount =
      (product.price - product.discountedPrice) * existingItem.quantity;

    await existingItem.save();
  } else {
    await CartItem.create({
      cart: cart._id,
      user: userId,
      product: product._id,
      productSku: product.productSku,
      quantity: 1,
      price: product.price,
      discountedPrice: product.discountedPrice,
      discount: product.price - product.discountedPrice,
      image: product.image,
    });
  }

  await updateCartTotals(cart._id);
  return await findUserCart(userId);
};

/* UPDATE CART ITEM QUANTITY */
const updateCartItemQuantity = async (userId, cartItemId, quantity) => {
  quantity = Number(quantity); // 🔥 FIX HERE

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const item = await CartItem.findById(cartItemId);
  if (!item) throw new Error("Cart item not found");

  if (item.user.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  const product = await Product.findById(item.product);
  if (!product) throw new Error("Product not found");

  item.quantity = quantity;
  item.price = product.price * quantity;
  item.discountedPrice = product.discountedPrice * quantity;
  item.discount =
    (product.price - product.discountedPrice) * quantity;

  await item.save();
  await updateCartTotals(item.cart);

  return item;
};


/* REMOVE CART ITEM */
const removeCartItem = async (userId, cartItemId) => {
  const item = await CartItem.findById(cartItemId);
  if (!item) throw new Error("Cart item not found");

  if (item.user.toString() !== userId.toString()) {
    throw new Error("Unauthorized");
  }

  await CartItem.findByIdAndDelete(cartItemId);
  await updateCartTotals(item.cart);

  return { message: "Item removed from cart" };
};

module.exports = {
  createCart,
  findUserCart,
  addCartItem,
  updateCartItemQuantity,
  removeCartItem,
};
