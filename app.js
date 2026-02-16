const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// User Routes Api
const User_Route = require('./routes/UserRoutes.js')
app.use('/api/v1/', User_Route);


// Product Routes Api
const Product_Route = require('./routes/ProductRoutes')
app.use('/api/v1', Product_Route);

// Cart Routes Api
const Cart_Route = require('./routes/CartRoutes')
app.use('/api/v1', Cart_Route);

// Orders Routes Api
const Order_Route = require('./routes/OrderRoutes')
app.use('/api/v1', Order_Route);

// Rating Routes Api
const RatingRoute = require('./routes/RatingRoutes.js')
app.use('/api/v1', RatingRoute);

// Wishlist Routes Api
const WishlistRoute = require('./routes/WishlistRoutes.js')
app.use('/api/v1', WishlistRoute);

// Review Routes Api
const ReviewRoute = require('./routes/ReviewRoutes.js')
app.use('/api/v1', ReviewRoute);

// Payment Routes Api
const PaymentRoutes = require(("./routes/PaymentRoutes.js"));
app.use("/api/v1", PaymentRoutes);

module.exports = app;


