const PaymentService = require ("../services/PaymentService.js");
const Payment = require('../models/Payment.js')
const OrderService  = require ('../services/OrderService.js')
const createPaymentLink = async (req, res) => {
  try {
    const result = await PaymentService.createPaymentLink(req.params.orderId);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("PAYMENT ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


const updatePaymentInformation = async (req, res) => {
  try {

    // Update Payment and Order
    const result = await PaymentService.updatePaymentInformation(req.query);

    // Fetch updated order and payment info
    const order = await OrderService.findOrderById(req.query.orderId);
    const payment = await Payment.findOne({ orderId: req.query.orderId });

    // Send all keys to frontend
    return res.status(200).json({
      success: true,
      message: "Payment successful",
      order: {
        _id: order._id,
        orderStatus: order.orderStatus,
        totalPrice: order.totalPrice,
        totalDiscountPrice: order.totalDiscountPrice,
        paymentDetails: order.paymentDetails,
        orderItems: order.orderItems,
        shippingAddress: order.shippingAddress
      },
      payment: {
        paymentId: payment.paymentId,
        paymentLinkId: payment.paymentLinkId,
        status: payment.status,
        amount: payment.amount,
        shortUrl: payment.shortUrl,
        createdAt: payment.createdAt
      }
    });
  } catch (error) {
    console.error("PAYMENT CALLBACK ERROR 👉", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = {
  createPaymentLink,
  updatePaymentInformation
};
