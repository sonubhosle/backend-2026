const express = require("express");
const authenticate = require("../middleware/Authenticate.js");
const admin = require("../middleware/Admin.js");
const OrderController = require("../controllers/OrderController.js");

const router = express.Router();

/* ================= ORDER ITEM HISTORY ================= */

// Get order item history (USER + ADMIN)
router.get("/history", authenticate, OrderController.getOrderItemHistory);

// Delete single order item from history (soft delete)
router.delete(
  "/history/:itemId",
  authenticate,
  OrderController.deleteOrderItem
);

/* ================= USER ORDERS ================= */

// Get logged-in user's orders
router.get("/my-orders", authenticate, OrderController.getUserOrders);

// Create order from cart
router.post("/create", authenticate, OrderController.createOrder);

// Cancel own order
router.put("/cancel/:id", authenticate, OrderController.cancelOrder);

/* ================= ADMIN ================= */

// Get all orders
router.get(
  "/admin-orders",
  authenticate,
  admin("ADMIN"),
  OrderController.getAllOrdersAdmin
);

// Update order status
router.put(
  "/status/:id",
  authenticate,
  admin("ADMIN"),
  OrderController.updateOrderStatusAdmin
);

// Delete order (admin only)
router.delete(
  "/delete/:id",
  authenticate,
  admin("ADMIN"),
  OrderController.deleteOrder
);

/* ================= SINGLE ORDER ================= */

// Get order by ID (KEEP LAST)
router.get("/:id", authenticate, OrderController.getOrderById);

module.exports = router;
