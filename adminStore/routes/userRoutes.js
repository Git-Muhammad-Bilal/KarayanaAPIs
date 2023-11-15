const express = require('express');
// const { getLoginUser, postLogoutUser, CreateUser } = require('../adminStore/controlers/auth');
const { getLoginUser, postLogoutUser, CreateUser, getStoreName, validateToken } = require('../controlers/auth');
const router = express.Router();


router.post('/login', getLoginUser )
router.get('/getStoreName',validateToken, getStoreName )
router.post('/logout', postLogoutUser)
router.post('/createAccount', CreateUser)



module.exports = router;