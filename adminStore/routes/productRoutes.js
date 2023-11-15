const express = require('express');
const { createProduct, getProducts, deleteProduct, editProduct } = require('../controlers/products');
const { validateToken } = require('../controlers/auth');

const router = express.Router();


router.post('/createOrUpdate', validateToken, createProduct) 
router.get('/getProducts',  validateToken, getProducts) 
router.delete('/deleteProduct/:id', validateToken, deleteProduct) 



module.exports = router;