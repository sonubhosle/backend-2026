
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter Your Name"]
    },
    surname: {
        type: String,
        required: [true, "Enter Your Surname"]
    },
    mobile: {
        type: Number,
        required: [true, "Enter Your Mobile No"]
    },
    email: {
        type: String,
        required: [true, "Enter Your Email"]
    },
     password: {
        type: String,
        required: [true, "Enter Your Password"]
    },
    role:{
        type:String,
        enum:['CUSTOMER','ADMIN'],
        default:"CUSTOMER"
    },
    photo:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})


const User = mongoose.model('users',userSchema);
module.exports = User