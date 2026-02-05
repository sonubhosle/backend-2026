const express = require ('express');
const router = express.Router();
const Cart_Controller = require  ('../controllers/CartController.js');
const authenticate = require ('../middleware/Authenticate.js')

router.get('/',authenticate, Cart_Controller.getUserCart);
router.put('/add',authenticate, Cart_Controller.addItemToCart);
router.put('/:id', authenticate, Cart_Controller.updateCartItem);
router.delete("/:id", authenticate, Cart_Controller.removeCartItem)



module.exports = router