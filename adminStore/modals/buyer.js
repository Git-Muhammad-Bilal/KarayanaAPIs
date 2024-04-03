const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const BuyersSchema = new Schema({
    buyerName: {
        type: String,
        required: true
        
    },
    
    userId:{
        type:Schema.Types.ObjectId,
        ref:'Users',
       },
    storeId:{
        type:Schema.Types.ObjectId,
        ref:'Stores',
       },
    
    purchases: [{ purchaseId:{
                       type:Schema.Types.ObjectId,
                       ref:'Sales',
                       required:true 
                   }              
                  }]

    })

module.exports = mongoose.model('Buyers', BuyersSchema)


// { productId:{  type: Schema.Types.ObjectId, 
//   ref:'Products', 
//   required: true 
// }















// const Products = require('../modals/productsModal')
// const fs = require('fs');
// const path = require('path');
// let p = path.join(__dirname, '../buyerInfoDb')

// class BuyerInfo {

//     readBuyerFile(req, res) {

//         let data = fs.readFileSync(p);
//         if (data.toString().length) {
//             return data = JSON.parse(data);
//         } else {
//             return []
//         }
//     }

//     writeBuyerFile(req, res, data) {
//         let BuyerId = Date.now();
//         let updatedBuyer;

//         if (data?.length) {
//             if (req.body?.id) {

//                 BuyerId = req.body.id
//                 updatedBuyer = data.map(b => {
//                     return b.id === req.body.id ? { ...b, ...req.body } : b


//                 })


//             } else {


//                 updatedBuyer = req.body === undefined ?
//                     [...data] :
//                     [...data, { ...req.body, id: BuyerId }];
//             }


//             fs.writeFileSync(p, JSON.stringify(updatedBuyer))

//             let result = updatedBuyer.filter((p) => {
//                 return p.userId.toString() === req.body.userId.toString()
//             })


//             res.send(result)
//             return BuyerId;
//         } else {

//             fs.writeFileSync(p, JSON.stringify([{ ...req.body, id: BuyerId }]))
//             res.send([{ ...req.body, id: BuyerId }])
//             return BuyerId;
//         }
//     }

//     fetchBuyersOfAProduct(productId, res) {
//         let buyers = this.readBuyerFile()

//         let result = buyers.filter((b) => {

//             if (b.productId?.toString() === productId?.toString()) {
//                 return b
//             }
//         })
//         return result
//     }



//     fetchAllBuyersOfAUser(userId) {
//         let buyers = this.readBuyerFile();
//         let products = new Products();
//         let result = buyers.map((b) => {

//             if (b.userId.toString() === userId.toString()) {
//                 let { productName } = products.findProductById(b.productId)
//                 return { ...b, productName }
//             }
//         })
//         return result;
//     }


//     removeBuyerOfADeletedProduct = (proudctId) => {
//         let buyers = this.readBuyerFile();
//         let result = buyers.filter(b => {
//             return b.productId.toString() !== proudctId.toString()
//         })
        
//         fs.writeFileSync(p, JSON.stringify(result))
//         return result
//     }


//     deleteBuyerById = (buyerId) => {
//         console.log(buyerId, 'fine');
//         let buyers = this.readBuyerFile();
//         let products = new Products()

//         let productId;

//         let result = buyers.filter(b => {
//             if (b?.id.toString() === buyerId?.toString()) {
//                 productId = b.productId
//             } else {
//                 return b
//             }


//         })
//         console.log(productId, 'productId');
//         fs.writeFileSync(p, JSON.stringify(result))

//         let res = result.filter((b) => {
//             return b.productId.toString() === productId.toString()
//         })

//         products.updateProductsWithBuyerPurchases(buyerId, productId)
//         return res
//     }


// }


// module.exports = BuyerInfo;

