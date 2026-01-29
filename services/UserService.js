const User = require('../models/User');
const bcrypt = require('bcrypt');
const JWT_PROVIDER = require('../config/JWT');

const createUser = async (userData) => {
    try {
        let { name, surname, email, password, photo, mobile, role } = userData;

        // Validate role
        if (role && !['CUSTOMER', 'ADMIN'].includes(role)) {
            throw new Error('Invalid role');
        }

        role = role || 'CUSTOMER';

        // Check if email exists
        const isExists = await User.findOne({ email });

        if (isExists) {
            throw new Error('Email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

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

    } catch (error) {
        throw error;
    }
};

const findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user || null;
    } catch (error) {
        console.error('Error finding user by email:', error.message);
        throw new Error(error.message);
    }
};


const getAllUsers = async () => {
    try {

        const users = await User.find();
        return users

    } catch (error) {
        throw new Error(error.message)
    }
}

const findUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user;

    } catch (error) {

        throw new Error(error.message);
    }
};

const getUserProfile = async (token) => {
    try {
        const userId = JWT_PROVIDER.getUserIdFromToken(token);
        const user = await findUserById(userId);

        if (!user) {
            throw new Error('Account Not Found');
        }

        return user;

    } catch (error) {
        throw new Error('Invalid Token or User Not Found');
    }
};

const updateUserProfile = async (userId, updateData) => {

    try {
        const allowedFields = ['name', 'surname', 'mobile', 'photo', 'email'];
        const updates = {};

        for (const key of allowedFields) {
            if (key in updateData) {
                updates[key] = updateData[key];
            }
        }

        delete updates.role;
        delete updates._id;

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

        if (!updatedUser) {
            throw new Error('User not found');
        }

        return updatedUser;
    } catch (error) {
        throw new Error(error.message);
    }
};

const logoutUser = async () => {
  try {
    return { message: 'Logout successful' };
  } catch (error) {
    throw new Error(error.message);
  }
};


module.exports = { createUser, getAllUsers, findUserByEmail, findUserById,logoutUser, getUserProfile,updateUserProfile };
