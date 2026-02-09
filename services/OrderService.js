const Address = require("../models/Address.js");
const Order = require("../models/Order.js");
const CartService = require("../services/CartService.js");
const OrderItem = require("../models/OrderItem.js");
const { sendEmail } = require("../config/email.js");
const orderEmailTemplate = require('../utils/emailTemplate.js');

// CLACULATE PRODUCT DISCOUNT
const calculateDiscountPercent = (price, discountedPrice) => {
  if (!price || price === 0) return 0;
  return Math.round(((price - discountedPrice) / price) * 100);
};

// FIND ORDER BY ID
const findOrderById = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("user")
    .populate({ path: "orderItems", populate: { path: "product" } })
    .populate("shippingAddress");

  if (!order) throw new Error("Order not found");
  return order;
};


//  CREATE ORDER FROM CART
const createOrder = async (user, shippingAddress) => {
  if (!shippingAddress || Object.keys(shippingAddress).length === 0) {
    throw new Error("Shipping address required");
  }

  let address;

  // Use existing address
  if (shippingAddress._id) {
    address = await Address.findById(shippingAddress._id);
    if (!address) throw new Error("Address not found");
  } 
  // Create new address
  else {
    address = await Address.create({
      ...shippingAddress,
      user: user._id,
    });
  }

  const { cart, items } = await CartService.findUserCart(user._id);

  if (!items || items.length === 0) {
    throw new Error("Cart is empty");
  }

  const orderItems = [];


  for (const item of items) {
    const orderItem = await OrderItem.create({
      product: item.product._id,
     skuCode: item.product.productSku,
      quantity: item.quantity,
      price: item.price,
      discountedPrice: item.discountedPrice,
      discount: item.price - item.discountedPrice,
      userId: user._id,
      image: item.image || item.product.image,
      title: item.product.title,
    });

    orderItems.push(orderItem._id);
  }

  const order = await Order.create({
    user: user._id,
    orderItems,
    shippingAddress: address._id,
    totalPrice: cart.totalPrice,
    totalDiscountPrice: cart.totalPayable,
    discount: cart.discount,
    totalItem: cart.totalItem,
  });

  return order;
};



//  UPDATE ORDER STATUS
const updateOrderStatus = async (orderId, status, emailSubject, emailMessage) => {
  const order = await findOrderById(orderId);
  order.orderStatus = status;
  await order.save();

  const html = orderEmailTemplate(order, emailSubject, emailMessage);
  try {
    await sendEmail(order.user.email, emailSubject, html);
  } catch (err) {
    console.error("Failed to send email:", err.message);
  }

  return order;
};

// PLACE ORDER
const placeOrder = (orderId) =>
  updateOrderStatus(
    orderId,
    "PLACED",
    "Order Placed Successfully 🎉",
    "Your order has been placed successfully. We’ll notify you once it’s confirmed."
  );

// CONFIRM ORDER
const confirmOrder = (orderId) =>
  updateOrderStatus(
    orderId,
    "CONFIRMED",
    "Order Confirmed ✅",
    "Your order has been confirmed and is being prepared for shipment."
  );

// SHIP ORDER
const shipOrder = (orderId) =>
  updateOrderStatus(
    orderId,
    "SHIPPED",
    "Order Shipped 🚚",
    "Your order is on its way! You can track its progress from your order details page."
  );

// DELIVER ORDER
const deliverOrder = (orderId) =>
  updateOrderStatus(
    orderId,
    "DELIVERED",
    "Order Delivered 📦",
    "Your order has been successfully delivered! We hope you enjoy your purchase."
  );

// CONCEL ORDER
const cancelOrder = (orderId) =>
  updateOrderStatus(
    orderId,
    "CANCELLED",
    "Order Cancelled ❌",
    "Your order has been cancelled. If you didn’t request this, please contact our support."
  );

//  USER ORDER HISTORY
const userOrderHistory = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate({
      path: "orderItems",
      populate: { path: "product", select: "title image price discountedPrice" },
    })
    .populate("shippingAddress")
    .sort({ createdAt: -1 })
    .lean();

  for (const order of orders) {
    for (const item of order.orderItems) {
      item.discountPercent = calculateDiscountPercent(item.price, item.discountedPrice);
      item.title = item.title || item.product?.title || "No title";
      item.image = item.image || item.product?.image || "";
    }
  }

  return orders;
};

// GET USER ORDERS
const getUserOrders = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate({ path: "orderItems", populate: { path: "product" } })
    .populate("shippingAddress")
    .sort({ createdAt: -1 })
    .lean();

  for (const order of orders) {
    for (const item of order.orderItems) {
      item.discountPercent = calculateDiscountPercent(item.price, item.discountedPrice);
      item.title = item.title || item.product?.title || "No title";
      item.image = item.image || item.product?.image || "";
    }
  }

  return orders;
};

// GET ALL ORDERS ADMIN
const getAllOrdersAdmin = async () => {
  const orders = await Order.find()
    .populate({ path: "orderItems", populate: { path: "product" } })
    .populate("user")
    .populate("shippingAddress")
    .sort({ createdAt: -1 })
    .lean();

  for (const order of orders) {
    for (const item of order.orderItems) {
      item.discountPercent = calculateDiscountPercent(item.price, item.discountedPrice);
      item.title = item.title || item.product?.title || "No title";
      item.image = item.image || item.product?.image || "";
    }
  }

  return orders;
};

// DELETE ORDER
const deleteOrderById = async (orderId) => {
   const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  await OrderItem.updateMany(
    { _id: { $in: order.orderItems } },
    { $set: { isDeleted: true } }
  );

  await Order.findByIdAndDelete(orderId);

  return { message: "Order deleted, items moved to history" };
};


const getHistory = async (user) => {
  const filter =
    user.role === "ADMIN"
      ? { isDeleted: true }
      : { userId: user._id, isDeleted: true };

  return await OrderItem.find(filter)
    .populate("product", "title image price discountedPrice")
    .sort({ createdAt: -1 })
    .lean();
};


const deleteOrderItem = async (orderItemId, user) => {
  const item = await OrderItem.findById(orderItemId);
  if (!item) throw new Error("Order item not found");

  if (user.role !== "ADMIN" && item.userId.toString() !== user._id.toString()) {
    throw new Error("Unauthorized");
  }

  item.isDeleted = true;
  await item.save();

  return { message: "Order item deleted successfully" };
};

// EXPORT ALL
module.exports =  {
  getHistory,
  deleteOrderItem,
  createOrder,
  placeOrder,
  confirmOrder,
  shipOrder,
  deliverOrder,
  cancelOrder,
  findOrderById,
  userOrderHistory,
  getAllOrdersAdmin,
  getUserOrders,
  deleteOrderById,
};