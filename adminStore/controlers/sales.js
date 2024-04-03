const date = require('moment');
const Sales = require('../modals/sales');
const Buyers = require('../modals/buyer')
const productsModal = require('../modals/productsModal');
const Purchases = require('../../buyer/modals/pourchases')

exports.createSales =  (socket, io) => {
    let user = socket.user
    socket.on('order', async  (data, callback) => {
         let bName = data[1] 
         let ifByrDsntExt = { buyerName:'', storeId: '', purchases:[]}
         let sales = [];
         let existingBuyer =await Buyers.findOne({ buyerName: bName, userId:user._id, storeId: data[0][0]?.userId })
         data[0]?.map( async (sale, ind)=>{
             const {_id, userId} = sale
             try {
                         
                 let  newSale  = await createSales(sale,bName, user._id)
                 sales.push(newSale)

                           ifByrDsntExt = {buyerName: bName,userId:user._id, storeId:userId, purchases:[...ifByrDsntExt?.purchases ,{ purchaseId: newSale._id }]}
                          
                           if (existingBuyer) {
                             await Buyers.updateOne( { buyerName: newSale.buyerName, storeId: newSale.store } , { $push: { purchases: { purchaseId: newSale._id } } })
                      
                          }else{
                              if (sales.length === data[0].length) {
                                 await Buyers.create(ifByrDsntExt)
                               }
                          }
                         await updateProductsPurcahsesIds(newSale)    
                         await createPurchase(sale, bName, user._id )
                         await productsModal.updateMany({_id:_id},{$inc:{"notfiedPurchases.purchaseCount":1},$set:{"notfiedPurchases.productId":_id}})
                          if (sales.length === data[0].length ) {
                            let productsNotificaoins= await productsModal.find({userId:userId}, {notfiedPurchases:1});
                            io.emit('receive', productsNotificaoins )
                            io.emit('receiveNewSales', sales)
                        }
                      } catch (error) {
                        console.log(error.message);
                    }
                    
                })
               callback( 'order has been placed', )
              })
           }


    async function createSales( sale ,bName, user_id){
    const {_id,productName, quantity, cost, price, userId, storeName} = sale
    let newSale = await new Sales({
        productName,
        buyerName:bName,
        quantity,
        cost,
        price,
        store:userId,
        product:_id,
        buyer: user_id
    }).save()
    return newSale
    }
     async function createPurchase(sale, bName, user_id){
    const {_id,productName, quantity, cost, price, userId, storeName} = sale
    let newPurchase =  await new Purchases({
        productName,
        buyerName:bName,
        quantity,
        cost,
        price, 
        user:user_id,
        store:userId, 
        storeName,
        purchaseDate:date().format('MMMM Do YYYY'),
        purchaseTime:date().format('h:mm:ss a'),
    }).save()
    return newPurchase
        } 
     async function updateProductsPurcahsesIds(sale){
      let prod = await productsModal.findById(sale.product)
    await productsModal.updateOne({ _id: sale.product }, { $push: { purchases: { purchase: sale._id } } });
    await productsModal.updateOne({ _id: sale.product }, { $set: { quantity: prod.quantity - sale.quantity } });
    }


 exports.getSalesNotification = async (req, res)=>{

        let storeId = req.user._id;
           try {
               let productsNotificaoins= await productsModal.find({userId:storeId}, {notfiedPurchases:1});
               res.status(200).send(productsNotificaoins)
             
           } catch (error) {
            res.status(204).send(error)
           }
    }



    exports.getSales = async (req, res) => {
    let { productId } = req.params
     try {

        await productsModal.findOneAndUpdate({ _id: productId },{$set:{notfiedPurchases:{productId:'', purchaseCount:0}}})
        let purchs = await Sales.find({ product: productId }, )
        res.status(200).send(purchs)
        if(!purchs) throw new Error('no content found')

    } catch (error) {
        res.status(204).send(error)
        
    }
}

exports.deleteSalesFromAproduct = async (req, res) => {
    let { purchaseId } = req.params
    try {
        let purchase = await Sales.findOneAndRemove({ _id: purchaseId })
        await Sales.removePurchasesFromABuyer(purchase)
        await Sales.removePurchasesFromAProduct(purchase)
        
        let deletedPurchases = await Sales.find({product:purchase.product})
        res.status(202).send(deletedPurchases);
        
    } catch (error) {
        console.log(error.message,'message');
        let code = purchaseId? 406:null
        res.status(code || 404).send(error.message)
        
    }
}

// exports.createSales = async (req, res) => {
   
//       const { buyerName, productName, quantity, cost, price, product} = req.body;
           
//     try {
//         if (req.body._id) {
//            editPurchase(req.body, res)
               
//         } else {
          
//          await new Sales({
//            productName,
//                 buyerName,
//                 quantity,
//                 cost,
//                 price,
//                 store:req.user._id,
//                 product,
//                 buyer: req.body.buyer
//             }).save();
//             res.status(201).send('purchase has been created Succsssfullyn')
//          }
         
         
//         } catch (error) {
//             console.log(error.message);
//             res.status(400).send(error)
//         }
//     }


//     async function editPurchase (body, res){
//         const {quantity, price, product , _id} = body
//         try {
//             let updatedPurchases = await Sales.findOneAndUpdate({ _id: _id }, { $set: { quantity, price } })
//             let prod = await Products.findById(product)
//              await Products.updateOne({ _id: product }, { $set: { quantity:updatedPurchases.quantity+prod.quantity - quantity } });
         
//              res.status(201).send(updatedPurchases)
//         } catch (error) {
//             res.status(400).send(error)
//         }
//     }



// exports.getSales = async (req, res) => {
    
//     let { productId } = req.params
//      try {

//         let purchs = await Sales.find({ product: productId })
//         res.status(200).send(purchs)
//         if(!purchs) throw new Error('no content found')

//     } catch (error) {
//         res.status(204).send(error)
           
//     }
// }

// exports.deleteSalesFromAproduct = async (req, res) => {
//     let { purchaseId } = req.params
//     try {
        
//         let purchase = await Sales.findOneAndRemove({ _id: purchaseId })
//         await Sales.removePurchasesFromABuyer(purchase)
//         await Sales.removePurchasesFromAProduct(purchase)
         
//         let deletedPurchases = await Sales.find({product:purchase.product})
//         res.status(202).send(deletedPurchases);
        
//     } catch (error) {
//         let code = purchaseId? 406:null
//         res.status(code || 404).send(error.message)
        
//     }
// }




  
    
    
    // let { buyerId } = req.params
    // console.log(buyerId, 'buyerid');
    // try {

        
        //     let { purchases } = await Buyers.findById(buyerId);
        //     let purIds = purchases.map(({ purchaseId }) => purchaseId.toString())
        //     await Purchases?.deleteMany({ _id: { $in: [...purIds] } })
        
        
        //     await Products.updateOne({ buyers: { $elemMatch: { buyerId: { $eq: buyerId } } } },
        //         { $pull: { buyers: { buyerId: buyerId } } })
        
        
        //     let afterDeletedProducts = await Buyers.deleteOne({ _id: buyerId })
        //     res.send(afterDeletedProducts)
        
    // } catch (error) {
    //     console.log(error.message);
    // }
// }

// exports.createBuyer =  (req, res) => {
//     const userId = req.body.userId
//     let products = new Products()
//     let buyers = new BuyerInfo()

//     let buyerParsedData =  buyers.readBuyerFile()

//     if (buyerParsedData.length) {
    //         let buyerId = buyers.writeBuyerFile(req, res, buyerParsedData)
    //         req.body.id === buyerId || products.updateProductsWithBuyerPurchases(buyerId, req.body.productId)
    
    //     } else {
        //         let buyerId = buyers.writeBuyerFile(req, res)
        //         products.updateProductsWithBuyerPurchases(buyerId, req.body.productId)
        //     }
        
        // }
        
        // exports.getBuyers =  (req, res) => {
//     let { id } = req.params
//     let buyers = new BuyerInfo();
//     let data =  buyers.fetchBuyersOfAProduct(id)
//     res.send(data);
// }

// exports.getBuyersList = (req, res) => {
    //     let { userId } = req.params
//     let buyers = new BuyerInfo()
//     let allBuyers = buyers.fetchAllBuyersOfAUser(userId);
//     res.send(allBuyers)
// }

// exports.deleteBuyerFromAproduct = (req, res) => {
    //     let { buyerId } = req.params
    //     console.log(buyerId, 'buyerid');
    //     let buyers = new BuyerInfo();
//     let result = buyers.deleteBuyerById(buyerId)
//     res.send(result)
// }


// exports.createBuyer = async (req, res) => {
//     const { buyerName, productName, quantity, cost, price, productId, userId } = req.body;
//     try {
//         if (req.body._id) {

//             return await Buyers.updateOne({ _id: req.body._id }, { $set: { buyerName } })

//         }

//         let existingBuyer = await Buyers.findOne({ buyerName: buyerName, userId: userId })

//         if (existingBuyer) {
//             let newPerchase = await new Purchases({ productName, quantity, cost, price, productId: productId }).save()

//             await Buyers.updateOne({ _id: existingBuyer._id }, { $push: { purchases: { purchaseId: newPerchase._id } } })
//             await Products.updateOne({ _id: productId }, { $push: { buyers: { buyerId: existingBuyer._id } } })

//         } else {

//             let purchase = await new Purchases({ productName, quantity, cost, price, productId: productId }).save()
//             let buyer = await new Buyers({ buyerName, userId, purchases: { purchaseId: purchase._id } }).save()
//             let m = await Purchases.updateOne({ _id: purchase.id }, { $set: { buyerId: buyer.id } })
//             console.log(m);
//             await Products.updateOne({ _id: productId }, { $push: { buyers: { buyerId: buyer._id } } })
//             res.send(buyer)

//         }

//     } catch (error) {
//         console.log(error.message);
//     }




// }