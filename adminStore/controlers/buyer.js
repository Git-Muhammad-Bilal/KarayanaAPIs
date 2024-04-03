let Products = require('../modals/productsModal');
let Buyers = require('../modals/buyer');
const Purchases = require('../modals/sales');
const purchases = require('../modals/sales');


exports.getBuyers = async (req, res) => {
    
    const { _id } = req.user
    try {
        let allBuyers = await Buyers.find({ storeId: _id })
        res.status(200).send(allBuyers)
        } catch (error) {
        res.status(404).send(error.message)
    }
}


exports.getBuyersPurchases = async (req, res) => {
    let { buyerId } = req.params
    try {
        let buyerDetail = await Buyers.find({ _id: buyerId}).populate(
             {
                path: 'purchases.purchaseId',
            }
        )
        res.send(buyerDetail)

    } catch (error) {
        console.log(error.message);
    }
}

exports.deleteBuyer = async (req, res) => {
    let { buyerId } = req.params

    const { _id } = req.user
    try {

        let buyer = await Buyers.findOneAndRemove({ _id: buyerId })
        let purcIds = buyer.purchases.map(p => p.purchaseId.toString())


        await Products.updateMany({ purchases:{ $elemMatch: { purchase: { $in: [...purcIds] } } } },
            { $pull: { purchases: { purchase: { $in: [...purcIds] } } } })
    
        await Purchases.deleteMany({ buyer: buyer._id })
        let afterDeletedBuyers = await Buyers.find({storeId:_id})
        res.send(afterDeletedBuyers)

    } catch (error) {
        console.log(error.message);
        res.send(error.message)
    }
}

