const express = require('express');
const router = express.Router();
const { getBuyers, getBuyersPurchases, deleteBuyer } = require('../controlers/buyer');
const { validateToken } = require('../controlers/auth');

router.get('/getBuyers',validateToken, getBuyers) 
router.get('/getBuyersPurchases/:buyerId',validateToken, getBuyersPurchases) 
router.get('/deleteBuyer/:buyerId',validateToken, deleteBuyer) 



module.exports = router;