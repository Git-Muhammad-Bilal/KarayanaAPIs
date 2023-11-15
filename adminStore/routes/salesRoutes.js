const express = require('express');
const router = express.Router();
const { getSales, deleteSalesFromAproduct, createSales, getSalesNotification } = require('../controlers/sales')
const { validateToken } = require('../controlers/auth');


router.post('/createPurchase', createSales) 
router.get('/getPurchases/:productId',validateToken,  getSales) 
router.delete('/deletePurchaseFromAproduct/:purchaseId',validateToken, deleteSalesFromAproduct) 
router.get('/getSalesNotificaions',validateToken, getSalesNotification) 



module.exports = router;