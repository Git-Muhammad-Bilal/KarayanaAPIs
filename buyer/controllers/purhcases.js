const Purchases = require("../modals/pourchases");


exports.getPurchases = async (req, res) => {
    try {
        let data = await Purchases?.find({user:req.user._id})
        
        if (data) {
            res.send(data);
        } else {
            res.status(204)
        }
    } catch (error) {
        console.log(error.message, 'purchases');
        res.staus(204).send(error.message)
    }
}


exports.deletedPurchases = async (req, res) => {
    let { purchaseId } = req.params
    try {
        
         await Purchases.findOneAndRemove({ _id: purchaseId })
        let  updatedPurchases = await Purchases.find({user:req.user._id})
        
        res.status(202).send(updatedPurchases);
        
    } catch (error) {
        let code = purchaseId? 406:null
        res.status(code || 404).send(error.message)
        
    }
}