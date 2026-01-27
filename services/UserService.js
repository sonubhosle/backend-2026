const User = require('../models/User');
const bcrypt = require('bcrypt');

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

const getAllUsers = async () => {
    try {

        const users = await User.find();
        return users

    } catch (error) {
        throw new Error(error.message)
    }
}
module.exports = { createUser,getAllUsers };
