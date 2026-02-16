const express = require ('express');
const router = express.Router();
const Cart_Controller = require  ('../controllers/CartController.js');
const authenticate = require ('../middleware/Authenticate.js')

router.get('/cart/user',authenticate, Cart_Controller.getUserCart);
router.put('/cart/add',authenticate, Cart_Controller.addItemToCart);
router.put('/cart/:id', authenticate, Cart_Controller.updateCartItem);
router.delete("/cart/:id", authenticate, Cart_Controller.removeCartItem)



module.exports = router