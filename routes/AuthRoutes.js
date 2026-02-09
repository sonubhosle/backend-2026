const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { upload } = require("../config/cloudnary");
const admin = require('../middleware/Admin');
const Authenticate = require('../middleware/Authenticate');

router.post('/signup', upload.single("photo"), AuthController.register);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword)
router.post('/reset-password', AuthController.resetPassword);
router.get('/users', Authenticate,admin('ADMIN'), AuthController.getAllUsers);
router.get('/profile', Authenticate, AuthController.getUserProfile);
router.put('/update', Authenticate, AuthController.updateProfile);


module.exports = router;
