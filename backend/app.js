const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.use('/app',(re,res) => {
   try {
       return res.status(201).send('OK')
   } catch (error) {
     return res.status(500).send(error.message)
   }
})

module.exports = app