import Cart from "../models/Cart";




const createCart = async (userId) => {

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = await Cart.create({ user: userId });
    }
    return cart;
};

module.exports = {createCart}