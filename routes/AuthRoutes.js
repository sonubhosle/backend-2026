const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { upload } = require("../config/cloudnary");

router.post('/signup', upload.single("photo"), AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

module.exports = router;
