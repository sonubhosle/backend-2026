const User = require('../models/User');
const bcrypt = require('bcrypt');
const JWT_PROVIDER = require('../config/JWT');
const crypto = require('crypto');

/* -------------------- HELPERS -------------------- */

const PASSWORD_REGEX =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

const generateResetToken = () =>crypto.randomBytes(20).toString('hex');

/* -------------------- CREATE USER -------------------- */

const createUser = async (userData) => {
    const { name, surname, email, password, photo, mobile } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Email already exists');
    }

    if (!PASSWORD_REGEX.test(password)) {
        throw new Error(
            'Password must have at least 8 chars, one uppercase, one number, and one symbol'
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔐 BOOTSTRAP ADMIN LOGIC
    const role =
        email === process.env.SUPER_ADMIN_EMAIL
            ? 'ADMIN'
            : 'CUSTOMER';

    const user = await User.create({
        name,
        surname,
        email,
        password: hashedPassword,
        photo,
        mobile,
        role
    });

    return user;
};

/* -------------------- FIND USER -------------------- */

const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

const findUserById = async (userId) => {
    return await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires').populate('ratings').populate('reviews');
};

/* -------------------- GET ALL USERS (ADMIN) -------------------- */

const getAllUsers = async () => {
    return await User.find().select('-password -resetPasswordToken -resetPasswordExpires')  
    .populate('ratings').populate('reviews');
};

/* -------------------- USER PROFILE -------------------- */

const getUserProfile = async (token) => {
    const userId = JWT_PROVIDER.getUserIdFromToken(token);
    const user = await findUserById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

/* -------------------- UPDATE PROFILE -------------------- */

const updateUserProfile = async (userId, updateData) => {

    const allowedFields = ['name', 'surname', 'mobile', 'photo', 'email'];
    const updates = {};

    allowedFields.forEach((field) => {
        if (updateData[field]) {
            updates[field] = updateData[field];
        }
    });

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');

    if (!updatedUser) {
        throw new Error('User not found');
    }

    return updatedUser;
};

/* -------------------- FORGOT PASSWORD -------------------- */

const setResetPasswordToken = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Email not found');

    const resetToken = generateResetToken();

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; 
    await user.save();

    return resetToken;
};

/* -------------------- RESET PASSWORD -------------------- */

const resetPassword = async (token, newPassword, confirmPassword) => {

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new Error('Invalid or expired token');
    }

    if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
        throw new Error(
            'Password must have at least 8 chars, one uppercase, one number, and one symbol'
        );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    return true;
};



/* -------------------- EXPORTS -------------------- */

module.exports = {
    
    createUser,
    findUserByEmail,
    findUserById,
    getAllUsers,
    getUserProfile,
    updateUserProfile,
    setResetPasswordToken,
    resetPassword
};
