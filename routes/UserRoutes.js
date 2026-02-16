const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { upload } = require("../config/cloudnary");
const admin = require('../middleware/Admin');
const Authenticate = require('../middleware/Authenticate.js');

router.post('/auth/signup', upload.single("photo"), AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/forgot-password', AuthController.forgotPassword)
router.post('/auth/reset-password', AuthController.resetPassword);
router.get('/user/users', Authenticate,admin('ADMIN'), AuthController.getAllUsers);
router.get('/user/profile', Authenticate, AuthController.getUserProfile);
router.put('/user/update', Authenticate, AuthController.updateProfile);


module.exports = router;
