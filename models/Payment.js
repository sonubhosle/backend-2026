const mongoose =  require ("mongoose");

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
        required: true
    },
    paymentId: { type: String, default: null },
    paymentLinkId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["PENDING", "COMPLETED", "FAILED"],
        default: "PENDING"
    },
    shortUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
