const express = require('express');
const app  = express();
const cors = require('cors');

 app.use(express.json());
 app.use(cors());

// Authentication Routes Api
const Auth_Route = require('./routes/AuthRoutes')
app.use('/api/v1/auth', Auth_Route);

// User Routes Api
const User_Route = require('./routes/UserRoutes')
app.use('/api/v1/user', User_Route);

// Product Routes Api
const Product_Route = require('./routes/ProductRoutes')
app.use('/api/v1/product', Product_Route);

// Cart Routes Api
const Cart_Route = require('./routes/CartRoutes')
app.use('/api/v1/cart', Cart_Route);


 module.exports = app;


