const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    name: {
        type: String,
        required: true

    },
    lastName: {
        type:   String,
        required: true

    },
    storeName: {
        type:   String,
        required: true

    },
    email: {
        type:  String ,
        required: true

    },

    password: {
        type: String,
        required: true

    },
     
    profile: {
        type: String,
    },
     
   
    products: [{
            productId: {type: Schema.Types.ObjectId, ref:'Products', required: true}
      }]
    

})




module.exports = mongoose.model('Stores', usersSchema)










// const fs = require('fs');
// const path = require('path');
// let p = path.join(__dirname, '../db')
// class UserModal {

//     readUserFile(req, res) {
//         let userData = fs.readFileSync(p);

//         if (userData.toString().length) {
//             return userData = JSON. parse(userData);
//         } else {
//             return []
//         }



//     }

//     writeUserFile(req, res, data, usersWithProducts) {
//         let userId = Date.now()

//         if (data?.length) {
//             let updtedUsrs = req.body === undefined ? [...data] : [...data, { ...req.body, id: userId }];

//             return fs.writeFileSync(p, JSON.stringify(updtedUsrs))

//         } else if (usersWithProducts) {

//             fs.writeFileSync(p, JSON.stringify(usersWithProducts))
//         }

//         else {

//             fs.writeFileSync(p, JSON.stringify([{ ...req.body, id: userId }]))
//             res.send({ id: userId })
//         }



//     }

//     findUser(users, req) {
//         let user = users.find(u => {
//             console.log(req.body, u);
//             return u.email === req.body.email && u.password === req.body.password ? u : null
//         })
//         return user
//     }

//     findUserById(userId) {
//         let parsedUsersData = this.readUserFile();
//         parsedUsersData.find((u) => {
//             return u.id.toString() === userId.toString()
//         })
//     }

//     removeDeletedProductId(productids, prodId) {
//         let ids = productids.filter(id => {
//             return id.toString() !== prodId.toString()
//         })
//         return ids
//     }

//     updateUserWithProducts(userId, productId) {

//         let parsedUsersData = this.readUserFile();

//         let result = parsedUsersData.map((user) => {

//             if (user.id.toString() === userId.toString()) {

//                 if (user?.products?.includes(Number(productId))) {
//                     let deletedProdsIds = this.removeDeletedProductId(user.products, productId)
//                      console.log(deletedProdsIds, 'delte');
//                     return {
//                         ...user,
//                         products:[...deletedProdsIds]
//                     }
//                 } else {

//                     return {
//                         ...user,
//                         products: user?.products ?
//                             [...user?.products, productId] :
//                             [productId]
//                     }
//                 }


//             }
//             return user

//         })
//         this.writeUserFile('', '', '', result)
//     }
// }

// module.exports = UserModal;