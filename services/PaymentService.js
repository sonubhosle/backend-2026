const Payment = require("../models/Payment.js");
const razorpay = require("../config/PAYMENT.js");
const OrderService = require("./OrderService.js");

const createPaymentLink = async (orderId) => {
    const order = await OrderService.findOrderById(orderId);

    if (!order) throw new Error("Order not found");
    if (!order.user) throw new Error("User not found");

    const mobile =
        order.user.mobile && String(order.user.mobile).length === 10
            ? String(order.user.mobile)
            : "9999999999";

    const paymentLink = await razorpay.paymentLink.create({
        amount: order.totalDiscountPrice * 100,
        currency: "INR",
        customer: {
            name: `${order.user.firstName || "Customer"} ${order.user.lastName || ""}`,
            email: order.user.email,
            contact: mobile
        },
        notify: { sms: true, email: true },
        reminder_enable: true,
        callback_url: `http://localhost:8585/api/payment/callback?orderId=${orderId}`,
        callback_method: "get"

    });

    await Payment.create({
        orderId,
        paymentLinkId: paymentLink.id,
        amount: order.totalDiscountPrice,
        status: "PENDING",
        shortUrl: paymentLink.short_url
    });

    return {
        paymentLinkId: paymentLink.id,
        paymentUrl: paymentLink.short_url
    };
};

const updatePaymentInformation = async (query) => {
  const {
    razorpay_payment_id,
    razorpay_payment_link_id,
    razorpay_payment_link_status,
    orderId
  } = query;

  if (!orderId) throw new Error("Order ID missing in callback");

  if (razorpay_payment_link_status !== "paid") {
    return { success: false, message: "Payment not completed" };
  }

  // 1️⃣ Update Payment collection
  await Payment.findOneAndUpdate(
    {
      orderId: orderId,
      paymentLinkId: razorpay_payment_link_id
    },
    {
      paymentId: razorpay_payment_id,
      status: "COMPLETED"
    }
  );

  // 2️⃣ Update Order
  const order = await OrderService.findOrderById(orderId);

  order.orderStatus = "CONFIRMED";
  order.paymentDetails = {
    paymentId: razorpay_payment_id,
    paymentStatus: "SUCCESS"   // 🔥 FIXED FIELD NAME
  };

  await order.save();

  return { success: true, message: "Payment successful" };
};


module.exports = {
    createPaymentLink,
    updatePaymentInformation
};
