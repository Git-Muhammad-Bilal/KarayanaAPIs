const Buyers = require('./buyer')
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
      productName:{
         type:String,
         required:true
         
      },
      quantity:{
          type:Number,
          required:true

      },
      cost:{
         type:Number,
         required:true

      },

    price:{
        type:Number,
         required:true

      },
      userId:{
         type:Schema.Types.ObjectId,
         ref:'Users',
 
     },
      buyers:[{
           buyerId: {type: Schema.Types.ObjectId, ref:'Buyers', required:true}
     }],
      
     purchases:[{
           purchase: {type: Schema.Types.ObjectId, ref:'Purchases', required:true}
     }],

     
     notfiedPurchases:{
       purchaseCount:{
         type:Number,   
         default:0
        },
       productId:{
            type:String
         }

   }
     
   
})


productSchema.post('findOneAndRemove', async function (doc) {

   let ids = doc.purchases.map(p=> {
         return  p.purchase.toString();
     })
     
      await Buyers.updateMany({purchases: { $elemMatch: { purchaseId:{$in:[...ids] } } } },
   { $pull: { purchases:{purchaseId:{$in:[...ids]}} } })

})



module.exports = mongoose.model('Products', productSchema)










































// const fs = require('fs');
// const Users = require('./userModal')
// const path = require('path');

// let p = path.join(__dirname, '../productDb')

// class Products {

//     readProductsFile(req, res) {

//         let data = fs.readFileSync(p);
//         if (data.toString().length) {
//             return data = JSON.parse(data);
//         } else {
//             return []
//         }
//     }

//     writeProductsFile(req, res, data) {
//         let productId = Date.now()
//         let updtedProducts;
//         if (data?.length) {
//             if (req.body?.id) {
//                 updtedProducts = data.map(p => {
//                     return p.id === req.body.id ? { ...p, ...req.body } : p
                      
//                 })

//             } else {

//                 updtedProducts = req.body === undefined ?
//                     [...data] :
//                     [...data, { ...req.body, id: productId }];
//             }

//             fs.writeFileSync(p, JSON.stringify(updtedProducts))

//             let fetchProductsOfAUser = updtedProducts.filter((p) => {
//                 return p.userId?.toString() === req.body.userId.toString()
//             })
//             res.send(fetchProductsOfAUser)
//             return productId;
//         } else {

//             fs.writeFileSync(p, JSON.stringify([{ ...req.body, id: productId }]))
//             res.send([{ ...req.body, id: productId }])
//             return productId;
//         }
//     }



//     getProducts(userId) {
//         let products = this.readProductsFile()
//         let result = products.filter((p) => {
//             return p?.userId?.toString() === userId?.toString()
//         })
//         return result;

//     }

//     deleteProductById(res, id) {
//         let products = this.readProductsFile()
//         let users = new Users();
//         let userId;
//         let result = products.filter(p => {
//             userId = p.userId
//             return p?.id.toString() !== id?.toString()
//         })

//         fs.writeFileSync(p, JSON.stringify(result))
//         users.updateUserWithProducts(userId, id)

//         return result;
//     }

//     editProductById(productId) {
//         let product = this.findProductById(productId)
//         return product;

//     }

//     findProductById = (prodId) => {
//         let products = this.readProductsFile();
//         let result = products.find((p) => {

//             if (p.id.toString() === prodId.toString()) {
//                 return p;
//             }
//         })
//         return result;
//     }



//     updateProductsWithBuyerPurchases = (BuyerId, productId) => {
//      console.log(BuyerId, productId);
//         let parsedProductsData = this.readProductsFile();

//         let result = parsedProductsData.map((p) => {

//             if (productId.toString() === p.id.toString()) {

//                 if (p?.purchases?.includes(Number(BuyerId) )) {
                      
//                 let afterRemovedPurchaes = this.removeDeletedBuyersPurchases(p.purchases, BuyerId)
                 
                
//                     return {
//                         ...p,
//                         purchases:
//                             [...afterRemovedPurchaes]
//                     }
//                 } else {

//                     return {
//                         ...p,
//                         purchases:
//                             p?.purchases ?
//                                 [...p?.purchases, BuyerId] :
//                                 [BuyerId]
//                     }

//                 }




//             }
//             return p

//         })
//         fs.writeFileSync(p, JSON.stringify(result))
//     }



//     removeDeletedBuyersPurchases(purchases, prodId) {


//         let ids = purchases.filter(id => {
//             return id.toString() !== prodId.toString()
//         })

//         return ids
//     }

// }


// module.exports = Products;