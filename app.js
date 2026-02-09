const express = require('express');
const app  = express();
const cors = require('cors');

 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
 app.use(cors());

// Authentication Routes Api
const Auth_Route = require('./routes/AuthRoutes')
app.use('/api/v1/auth', Auth_Route);


// Product Routes Api
const Product_Route = require('./routes/ProductRoutes')
app.use('/api/v1/product', Product_Route);

// Cart Routes Api
const Cart_Route = require('./routes/CartRoutes')
app.use('/api/v1/cart', Cart_Route);

// Orders Routes Api
const Order_Route = require('./routes/OrderRoutes')
app.use('/api/v1/order', Order_Route);

const PaymentRoutes = require (("./routes/paymentRoutes.js"));

app.use("/api/payment", PaymentRoutes);

 module.exports = app;


