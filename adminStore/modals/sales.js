const mongoose = require('mongoose');
const Buyers = require('./buyer')
const Products = require('./productsModal')
const Schema = mongoose.Schema;


const SalesSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    buyerName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true

    },

    cost: {
        type: Number,
        required: true

    },

    price: {
        type: Number,
        required: true

    },
    store: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },

    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'Buyers',
        // required: true
    }

});



SalesSchema.statics.removePurchasesFromAProduct = async function (doc) {
    let prod = await Products.findById(doc.product)
    await Products.updateOne({ _id: doc.product }, { $set: { quantity: prod?.quantity + doc?.quantity } });

    await Products.updateOne({ purchases: { $elemMatch: { purchase: doc._id } } },
        { $pull: { purchases: { purchase: doc._id } } })
      prod.notfiedPurchases.purchaseCount == 0 || await Products.updateOne({_id:doc.product},{$inc:{"notfiedPurchases.purchaseCount":-1},$set:{"notfiedPurchases.productId":doc.product}})
 
    

}


SalesSchema.statics.removePurchasesFromABuyer = async function (doc) {

    await Buyers.updateOne({ purchases: { $elemMatch: { purchaseId: doc._id } } },
        { $pull: { purchases: { purchaseId: doc._id } } })

}

// SalesSchema.pre('save', async function (next) {
//     let existingBuyer = await Buyers.findOne({ buyerName: this.buyerName, userId: this.store })    
    
//     if (existingBuyer) {
//        let byr = await Buyers.updateOne({ userId: this.store }, { $push: { purchases: { purchaseId: this._id } } })    
//        this.buyer = byr.id

//     } else {
        
//         let newbuyer = await Buyers.create({ buyerName: this.buyerName, userId: this.store, purchases: { purchaseId: this._id } })    
//         this.buyer = newbuyer.id
//     }
//     let prod = await Products.findById(this.product)
//     await Products.updateOne({ _id: this.product }, { $push: { purchases: { purchase: this._id } } });
//     await Products.updateOne({ _id: this.product }, { $set: { quantity: prod.quantity - this.quantity } });
//     next()
// })









module.exports = mongoose.model('Sales', SalesSchema)