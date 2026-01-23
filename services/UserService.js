const User = require('../models/User');
const bcrypt = require('bcrypt');

const createUser = async (userData) => {
    try {
        let { name, surname, email, password, photo, mobile, role } = userData;


        if (role && !['CUSTOMER', 'ADMIN'].includes(role)) {
            throw new Error['Invalid role']
        }
        role = role || 'CUSTOMER'

        const isExists = await User.findOne({ email });

        if (isExists) {
            throw new Error['Email Already Exist']
        }

        // hash

        password = await bcrypt.hash(password, 10);
        const user = await User.create({ name, surname, email, password, photo, mobile, role });
        return user;

    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = {createUser}