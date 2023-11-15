const express = require('express');
const { CreateUser} = require('../controllers/buyerAtuh');
const { getLoginUser, validateToken } = require('../../adminStore/controlers/auth');
const router = express.Router();


router.post('/createBuyer',CreateUser )
router.post('/loginBuyer',getLoginUser )



module.exports = router;