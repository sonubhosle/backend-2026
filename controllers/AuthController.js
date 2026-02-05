
const UserService = require('../services/UserService');
const JWT_PROVIDER = require('../config/JWT');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../config/email');
const CartService = require('../services/CartService')
const register = async (req, res) => {
  try {
    const { name, surname, mobile, email, password, photo } = req.body;

    // Validate required fields
    if (!name || !surname || !mobile || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const userData = {
      name,
      surname,
      mobile,
      email: email.toLowerCase(),
      password,
      photo
    };

    // Create user
    const user = await UserService.createUser(userData);
    // Generate token
    const jwt = JWT_PROVIDER.generateToken(user._id);
    
    await CartService.createCart(user);

    // Remove sensitive data
    user.password = undefined;

    return res.status(201).json({
      message: "User registered successfully",
      jwt,
      user
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const login = async (req, res) => {
  const { password, email } = req.body;

  try {
    let user;
    if (email) user = await UserService.findUserByEmail(email);
    if (!user) return res.status(404).send({ message: 'User not found.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).send({ message: 'Invalid Password' });

    const jwt = JWT_PROVIDER.generateToken(user._id);

    return res.status(200).send({
      jwt,
      message: 'Login Success',
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const result = await UserService.logoutUser();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) return res.status(400).send({ message: "Email is required" });

    const resetToken = await UserService.setResetPasswordToken(email);

    // Send email with reset link
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const html = `<p>You requested a password reset.</p>
                  <p>Click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`;

    await sendEmail(email, 'Reset Your Password', html);

    return res.status(200).send({ message: "Reset password link sent to email" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  try {
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).send({ message: "Token and passwords are required" });
    }

    const user = await UserService.resetPassword(token, newPassword, confirmPassword);

    return res.status(200).send({ message: "Password reset successfully", user });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { register, login, logout, forgotPassword, resetPassword };
