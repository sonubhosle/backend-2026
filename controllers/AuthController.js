const UserService = require('../services/UserService');
const JWT_PROVIDER = require('../config/JWT');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../config/email');
const CartService = require('../services/CartService');



// REGISTER
const register = async (req, res) => {
  try {
    const photoUrl = req.file ? req.file.path : '';

    const { name, surname, mobile, email, password } = req.body;

    if (!name || !surname || !mobile || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await UserService.createUser({
      name,
      surname,
      mobile,
      email: email.toLowerCase(),
      password,
      photo: photoUrl
    });

    const jwt = JWT_PROVIDER.generateToken(user._id);

    await CartService.createCart(user);

    user.password = undefined;

    return res.status(201).json({
      message: 'User registered successfully',
      jwt,
      user
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// LOGIN

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await UserService.findUserByEmail(email.toLowerCase());
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const jwt = JWT_PROVIDER.generateToken(user._id);

    // Remove password before sending response
    user.password = undefined;

    return res.status(200).json({
      message: "Login successful",
      jwt,
      user   // ✅ VERY IMPORTANT
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const resetToken = await UserService.setResetPasswordToken(email);

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const html = `
      <p>You requested a password reset.</p>
      <p>Click the link below:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `;

    await sendEmail(email, 'Reset Your Password', html);

    return res.status(200).json({
      message: 'Reset password link sent to email'
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: 'Token and passwords are required'
      });
    }

    await UserService.resetPassword(token, newPassword, confirmPassword);

    return res.status(200).json({
      message: 'Password reset successful'
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



// GET ALL USERS (ADMIN)
const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// GET LOGGED-IN USER PROFILE
const getUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token not found' });
    }

    const user = await UserService.getUserProfile(token);
    return res.status(200).json(user);

  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.photo = req.file.path;
    }

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === '') delete updateData[key];
    });

    const updatedUser = await UserService.updateUserProfile(userId, updateData);

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};




module.exports = {

  register,
  login,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getUserProfile,
  updateProfile
};
