const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true

    },
    lastName: {
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
   
    
   
    // products: [{
    //         productId: {type: Schema.Types.ObjectId, ref:'Products', required: true}
    //   }]
    

})




module.exports = mongoose.model('Users', userSchema)










