const express = require('express');
const { getStores } = require('../controllers/getStore');
const { getProducts } = require('../../adminStore/controlers/products');
const { getBuyerName } = require('../controllers/buyerAtuh');
const { validateToken } = require('../../adminStore/controlers/auth');
const router = express.Router();


router.get('/buyerName',validateToken, getBuyerName )
router.get('/getStores', getStores )
router.get('/getProducts/:storeId', getProducts )



module.exports = router;