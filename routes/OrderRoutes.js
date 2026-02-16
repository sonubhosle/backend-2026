const express = require("express");
const authenticate = require("../middleware/Authenticate.js");
const admin = require("../middleware/Admin.js");
const OrderController = require("../controllers/OrderController.js");

const router = express.Router();


router.get("/orders/history", authenticate, OrderController.getOrderItemHistory);
router.delete("/order/history/:itemId",authenticate,OrderController.deleteOrderItem);
router.get("/user/orders", authenticate, OrderController.getUserOrders);
router.post("/user/order/create", authenticate, OrderController.createOrder);
router.put("/user/order/cancel/:id", authenticate, OrderController.cancelOrder);


router.get("/admin/orders", authenticate, admin("ADMIN"), OrderController.getAllOrdersAdmin);
router.put("/order/status/:id",authenticate,admin("ADMIN"),OrderController.updateOrderStatusAdmin);
router.delete( "/order/delete/:id",authenticate,admin("ADMIN"),OrderController.deleteOrder);
router.get("/order/:id", authenticate, OrderController.getOrderById);

module.exports = router;
