const express = require ("express");
const PaymentController  = require("../controllers/PaymentController.js");
const authenticate = require ("../middleware/authenticate.js");

const router = express.Router();

// create payment link
router.post(
  "/create/:orderId",
  authenticate,
  PaymentController.createPaymentLink
);


router.get("/callback", PaymentController.updatePaymentInformation);


module.exports =  router;
