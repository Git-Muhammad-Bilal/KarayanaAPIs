let Users = require('../modals/store')
let BuyerUser = require('../../buyer/modals/Buyer')
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt')

const {getHashedPassword } = require('../../Hashing/hasingPassowrd');

require('dotenv').config()



exports.createAccessToken = (req,curLogedInUser)=>{
    return createToken(req, curLogedInUser)
    
} 

function createToken(req, curLogedInUser) {
    req.user = curLogedInUser
    const user = {name:curLogedInUser.email, _id:curLogedInUser.id}
    const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN) 
         return accessToken;
    
}
exports.CreateUser = async(req, res)=>{
    const {name, lastName, email, password, storeName} = req.body
    const hashPassword = await getHashedPassword(password);
    let users =new Users({name, lastName, email, password:hashPassword, storeName })
      try {
         let isExistingUser = await Users.findOne({email:email })
         if (!isExistingUser) {
              await users.save();
             let accessToken =  createToken(req,users)
             res.send({buyerOrStore:'store', accessToken})
        }else{
            res.status(409).send('Email is already taken')
        }
    } catch (error) {

        res.status(404).send(error)
    }

    
    
}


exports.getLoginUser = async (req, res) => {
    const {email, password, store} = req.body
    let userOrStore = store? Users:BuyerUser
    let curLogedInUser = await userOrStore.findOne({email:email})
    const comparePass =curLogedInUser && await bcrypt.compare(password , curLogedInUser?.password);
    
   try {
        
        if (curLogedInUser && comparePass) {
            let buyerOrStore = store?'store':'buyer'
            let accessToken =  createToken(req, curLogedInUser)
            res.send({buyerOrStore,accessToken})
        }else {
          return res.status(401).send(!curLogedInUser?'user not found':'password not found')
        }
       
    } catch (error) {
        res.status(400).send(error.message)
    }
}

exports.getStoreName = async (req, res) => {
    const {_id} = req.user
    let curLogedInUser = await Users.findOne({_id:_id})
    
     try {
       if (curLogedInUser) {
        res.send(curLogedInUser.storeName)
         }else {
              res.status(401).send({err:'user not found'})
         }
     } catch (error) {
        res.status(400).send(error.message)
}
    

}

exports.postLogoutUser = async (req, res) => {
    try {
        console.log(req.body);
        //  await Users.findById(req.body.id);
        res.status(200).send('succefyly loged out')
        
    } catch (error) {
        res.status(205) 
    }

     
}


exports.validateToken = (req, res, next)=>{
      
    const token = req.headers.token;
    if (token === null) {
        return res.sendStatus(403);
    }
    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user)=>{
        if(err)return res.sendStatus(403);
            req.user = user;    
            next()
      })
}







// let UserModal = require('../modals/userModal')


// exports.CreateUser = async(req, res)=>{
//     let users = new UserModal()
//     let usersParsedData = await users.readUserFile()
//     if (usersParsedData.length) {
    
//        users.writeUserFile(req, res, usersParsedData)
//     }else{
//         users.writeUserFile(req, res)
//     }
 
// }

// exports.getLoginUser = async (req, res) => {
//     let users = new UserModal()

//     let usersParsedData =  users.readUserFile()
//     let authUsr = await users.findUser(usersParsedData, req)

//     if (authUsr) {
//         let updtdUsr = usersParsedData?.map(u => {
//             if (u.email === authUsr.email && u.password === authUsr.password) {
//                 return { ...u, isLogedIn: true };
//             }
//             return u;
//         })
//         res.send({ lgnUser:authUsr })
//         users.writeUserFile('', res, updtdUsr)
//     } else {
       
//        res.send({err:'user not found'})
//     }
// }

// exports.postLogoutUser = (req, res) => {
//     let users = new UserModal();
//     let usersList = users.readUserFile(req, res);
//     let updatedUsrs = usersList?.map(u => {
        
//         if (u.id.toString() === req.body.id.toString()) {
//             return { ...u, isLogedIn: false };
//         }
//         return u;
//     })
    
//     users.writeUserFile('', res, updatedUsrs)
// }