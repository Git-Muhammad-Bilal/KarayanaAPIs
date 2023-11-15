let cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
let jwt = require('jsonwebtoken');
const server = require('http').createServer(app)
require('dotenv').config()

let bodyParser = require('body-parser');
app.use(express.static('profilesImagess'))
app.use(bodyParser.json())
app.use(cors("http://localhost:3000/"));
const io = require('socket.io')(server, {
    cors: "http://localhost:3000/"
})




const userRoutes = require('./adminStore/routes/userRoutes')
const productRoutes = require('./adminStore/routes/productRoutes')
const salesRoutes = require('./adminStore/routes/salesRoutes')
const buyerRoutes = require('./adminStore/routes/buyerRoutes');
const uploadProfile = require('./adminStore/routes/uploadProfileRoutes');
const { createSales } = require('./adminStore/controlers/sales');

const fetchStoresRoutes = require('./buyer/routes/fetchStoresRoutes');
const createUserRoutes = require('./buyer/routes/createUserRoutes');
const getPurchasesRoutes = require('./buyer/routes/getPurchasesRoutes');

io.on('connection',(socket)=>{
     createSales(socket, io)

     
 })
io.use(function(socket, next){
     let token = socket.handshake.auth.jwt
    if (token){
        jwt.verify(socket.handshake.auth.jwt, process.env.ACCESS_SECRET_TOKEN, function(err, user) {
        if (err) return next(new Error('Authentication error'));
        socket.user = user;
        next();
      });
    }
    else {
      next(new Error('Authentication error'));
    }    
  })


// Stores routes

app.use(userRoutes)
app.use(productRoutes)
app.use(salesRoutes)
app.use(buyerRoutes)
app.use(uploadProfile)

// Buyer Routes

app.use(fetchStoresRoutes)
app.use(createUserRoutes)
app.use(getPurchasesRoutes)


mongoose.connect('mongodb://127.0.0.1:27017/KaryanaStore').then((result) => {
    console.log('connected');
    server.listen(3003, (err) => {
        console.log('listning on port 3003');
    })


}).catch(err => {
    console.log(err);
})

