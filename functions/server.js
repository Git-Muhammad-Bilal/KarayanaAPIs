let cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const serverless = require('serverless-http');

const app = express();
let jwt = require('jsonwebtoken');
const server = require('http').createServer(app)
require('dotenv').config()
app.use(cors({
  origin: '*',
}));

app.options('*', cors())

let bodyParser = require('body-parser');
app.use(express.static('./profilesImagess'))
app.use(bodyParser.json())

const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
})

const userRoutes = require('../adminStore/routes/userRoutes')
const productRoutes = require('../adminStore/routes/productRoutes')
const salesRoutes = require('../adminStore/routes/salesRoutes')
const buyerRoutes = require('../adminStore/routes/buyerRoutes');
const uploadProfile = require('../adminStore/routes/uploadProfileRoutes');
const { createSales } = require('../adminStore/controlers/sales');

const fetchStoresRoutes = require('../buyer/routes/fetchStoresRoutes');
const createUserRoutes = require('../buyer/routes/createUserRoutes');
const getPurchasesRoutes = require('../buyer/routes/getPurchasesRoutes');



// Stores routes

app.use('/.netlify/functions/server', userRoutes)
app.use('/.netlify/functions/server', productRoutes)
app.use('/.netlify/functions/server', salesRoutes)
app.use('/.netlify/functions/server', buyerRoutes)
app.use('/.netlify/functions/server', uploadProfile)

// Buyer Routes

app.use('/.netlify/functions/server', fetchStoresRoutes)
app.use('/.netlify/functions/server', createUserRoutes)
app.use('/.netlify/functions/server', getPurchasesRoutes)

app.post('/message', (req, res) => {
  const { message } = req.body;

  // Emit the message to all connected clients
  io.on('connection', (socket) => {
  
    console.log(socket, 'socket');
    createSales(socket, io)
  })
  
  
  io.use(function (socket, next) {
    let token = socket.handshake.auth.jwt
    console.log(token);
    if (token) {
      jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, function (err, user) {
        if (err) return next(new Error('Authentication error'));
        socket.user = user;
        next();
      });
    }
    else {
      next(new Error('Authentication error'));
    }
  })

  // Respond with a success message
  res.json({ success: true, message: 'Message forwarded successfully' });
});







mongoose.connect(process.env.DATABASE_URI).then((result) => {
  try {
    console.log('connect');
  } catch {
    throw new Error('something wrong with database')
  }
}).catch(err => {
  console.log(err);
})

module.exports.handler = serverless(server);

