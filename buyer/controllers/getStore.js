const Store = require("../../adminStore/modals/store");


exports.getStores = async (req, res) => {

    try {
        let data = await Store.find()
        if (data) {
            res.send(data);
        } else {
            res.status(204)
        }
    } catch (error) {
        res.staus(204).send(error.message)
    }
}