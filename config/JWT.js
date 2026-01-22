const jwt = require('jsonwebtoken');


const generateToken = (userId) =>{
    return jwt.sign({userId},process.env.JWT_SECRET,{expiresIn: "48h"});
}

const getUserIdFromToken = (token) =>{
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
    return decodedToken.userId;
}

module.exports = {generateToken,getUserIdFromToken}
