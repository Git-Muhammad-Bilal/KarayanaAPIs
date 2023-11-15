const express = require('express');
const { validateToken } = require('../../adminStore/controlers/auth');
const { getPurchases, deletedPurchases } = require('../controllers/purhcases');
const router = express.Router();



router.get('/getPurchases',validateToken, getPurchases )
router.delete('/deletePurchase/:purchaseId',validateToken , deletedPurchases)

module.exports = router;