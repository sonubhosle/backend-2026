const OrderService = require ("../services/OrderService.js");


// Create order from cart
const createOrder = async (req, res) => {
  try {
    const user = req.user;
    const shippingAddress = req.body.shippingAddress;

    if (!shippingAddress) {
      return res.status(400).json({ success: false, error: "Shipping address required" });
    }

    const order = await OrderService.createOrder(user, shippingAddress);
    return res.status(201).json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get logged-in user's orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await OrderService.userOrderHistory(req.user._id);
    return res.status(200).json({ success: true, data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Get single order (only user's own)
const getOrderById = async (req, res) => {
  try {
    const order = await OrderService.findOrderById(req.params.id);

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

// Cancel user's own order
const cancelOrder = async (req, res) => {
  try {
    const order = await OrderService.findOrderById(req.params.id);

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    const cancelledOrder = await OrderService.cancelOrder(req.params.id);
    return res.status(200).json({ success: true, data: cancelledOrder });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ================= ADMIN FUNCTIONS ==================

// Get all orders (admin)
const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await OrderService.getAllOrdersAdmin();
    return res.status(200).json({ success: true, data: orders });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update order status (admin)
const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body; // status: "PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"
    let updatedOrder;

    switch (status) {
      case "PLACED":
        updatedOrder = await OrderService.placeOrder(req.params.id);
        break;
      case "CONFIRMED":
        updatedOrder = await OrderService.confirmOrder(req.params.id);
        break;
      case "SHIPPED":
        updatedOrder = await OrderService.shipOrder(req.params.id);
        break;
      case "DELIVERED":
        updatedOrder = await OrderService.deliverOrder(req.params.id);
        break;
      case "CANCELLED":
        updatedOrder = await OrderService.cancelOrder(req.params.id);
        break;
      default:
        return res.status(400).json({ success: false, error: "Invalid status" });
    }

    return res.status(200).json({ success: true, data: updatedOrder });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Delete order (admin)
const deleteOrder = async (req, res) => {
  try {
    const order = await OrderService.deleteOrderById(req.params.id);
    return res.status(200).json({ success: true, data: order });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

// Order History
const getOrderItemHistory = async (req, res) => {
  try {
    const history = await OrderService.getHistory(req.user);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE ORDER ITEM
const deleteOrderItem = async (req, res) => {
  try {
    const result = await OrderService.deleteOrderItem(
      req.params.itemId,
      req.user
    );

    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(403).json({ success: false, error: error.message });
  }
};



module.exports = {
  getOrderItemHistory,
  deleteOrderItem,
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  deleteOrder,
};