

const mongoose = require('mongoose')

const databaseConnect = () => {
    mongoose.connect(process.env.DB_URI,{family:4})
    .then(() => console.log('Database Connected'))
    .catch(err =>{
        console.log('Faild To Connect',err)
    })
}

module.exports = databaseConnect;