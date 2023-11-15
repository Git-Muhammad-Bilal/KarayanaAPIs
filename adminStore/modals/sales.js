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




SalesSchema.pre('save', async function (next) {

    let existingBuyer = await Buyers.findOne({ buyerName: this.buyerName }).exec()

    if (existingBuyer) {
        await Buyers.updateOne({ _id: existingBuyer.id }, { $push: { purchases: { purchaseId: this._id } } })
        this.buyer = existingBuyer.id
    } else {
        let newbuyer = await new Buyers({ buyerName: this.buyerName, userId: this.store, purchases: { purchaseId: this._id } }).save();
        this.buyer = newbuyer.id
    }
    let prod = await Products.findById(this.product)
    await Products.updateOne({ _id: this.product }, { $push: { purchases: { purchase: this._id } } });
    await Products.updateOne({ _id: this.product }, { $set: { quantity: prod.quantity - this.quantity } });
    next()
})



SalesSchema.statics.removePurchasesFromAProduct = async function (doc) {
    let prod = await Products.findById(doc.product)
    await Products.updateOne({ _id: doc.product }, { $set: { quantity: prod?.quantity + doc?.quantity } });
           
    await Products.updateOne({ purchases: { $elemMatch: { purchase: doc._id } } },
            { $pull: { purchases: { purchase: doc._id } } })
}


SalesSchema.statics.removePurchasesFromABuyer = async function (doc) {

    await Buyers.updateOne({ purchases: { $elemMatch: { purchaseId: doc._id } } },
        { $pull: { purchases: { purchaseId: doc._id } } })

}






module.exports = mongoose.model('Sales', SalesSchema)