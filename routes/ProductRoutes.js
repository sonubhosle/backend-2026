const express = require ('express') ;
const router = express.Router();
const authenticate = require ('../middleware/Authenticate') 
const admin  = require ('../middleware/Admin.js');
const Product_Controller = require ('../controllers/ProductController.js');
const { uploadProduct } = require ('../config/cloudnary.js');

/* ADMIN */
router.post( "/create",authenticate,admin("ADMIN"), uploadProduct, Product_Controller.createProduct);



module.exports = router