const express = require('express');
const router = express.Router();
const { validateToken } = require('../controlers/auth');
const { uploadProfile, getStoreProfile, removeProfile } = require('../controlers/profile');
const path  = require('path')
 let p = path.join(__dirname, '../profilesImagess')
 
 const multer = require('multer');
 
 const storage = multer.diskStorage({
   destination: function (req, file, cb) {
       cb(null, './profilesImagess')
  },
  
  filename: function (req, file, cb) {
    cb(null, req.user._id + file.originalname)
  }
})
const upload = multer({ storage})

router.post('/uploadProfile', validateToken, upload.single('profileImage'), uploadProfile)
router.get('/getStoreProfile', validateToken, getStoreProfile)
router.post('/removeProfile/:fileName', validateToken, removeProfile)



module.exports = router;