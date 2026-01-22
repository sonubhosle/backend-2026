const express = require('express');
const app  = express();
const cors = require('cors');

 app.use(express.json());
 app.use(cors());

  app.use('/', (req,res) =>{
            try {
                    res.send('Working')
            } catch (error) {
                    res.status('404')
            }
  })
//  Routing Start


 module.exports = app;



//  https://localhost:5173
// http://localhost:8585