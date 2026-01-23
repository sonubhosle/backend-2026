
const UserService = require('../services/UserService');
const JWT_PROVIDER = require('../config/JWT')
const register = async (req, res) => {
  try {
   
    const body = Object.assign({}, req.body);
    const { name, surname, mobile, email, password, photo } = body;

    // Check required fields
    if (!name || !surname || !mobile || !email || !password ) {
      return res.status(400).send({ message: "All fields are required" });
    }

    // Prepare user data
    const userData = { name, surname, mobile, email, password, photo };

    // Create user in DB
    const user = await UserService.createUser(userData);

    // Generate JWT
    const jwt = JWT_PROVIDER.generateToken(user._id);



    return res.status(200).send({
      jwt,
      message: "User Registered Successfully",
      user,
    });

  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};