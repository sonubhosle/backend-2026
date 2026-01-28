
const UserService = require('../services/UserService');
const JWT_PROVIDER = require('../config/JWT');
const bcrypt = require('bcrypt');

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


module.exports = { register,login };
