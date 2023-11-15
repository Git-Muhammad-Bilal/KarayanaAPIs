const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
    productName: {
        type: String,
        required: true

    },
    buyerName: {
        type:   String,
        required: true

    },
    quantity: {
        type:  Number ,
        required: true

    },

    price: {
        type: Number,
        required: true

    },
    cost: {
        type: Number,
        required: true

    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: 'Stores',
    },
    storeName: {
        type: String,     
        
    },
    
    purchaseDate:{
        type:String
    },

    purchaseTime:{
        type:String
    }

     
})




module.exports = mongoose.model('Purchases', purchaseSchema)










