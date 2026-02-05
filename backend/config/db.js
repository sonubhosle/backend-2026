const mongoose = require('mongoose')

const DbConnect = () => {
    mongoose.connect('mongodb://localhost:27017/xyz', { family: 4 })
        .then(() => console.log('Connection Done')).catch(error => {
            console.log('Connection Faild', error)
        })
}

module.exports = DbConnect