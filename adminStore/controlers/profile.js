const fs = require('fs');
const Users = require('../modals/store');

exports.uploadProfile = async (req, res) => {
    try {
        await Users.updateOne({ _id: req.user._id }, { $set: { 'profile': req.file?.filename } })
        res.send(req.file)
    } catch (error) {
        res.status(400).send(error.message)
    }
}

exports.getStoreProfile = async (req, res) => {
    try {
        let user = await Users.findOne({ _id: req.user._id })
        res.send(user?.profile);

    } catch (error) {
        res.status(400).send(error.message)

    }


}

exports.removeProfile = async (req, res) => {
    let { fileName } = req.params;
    fs.unlink('./profilesImagess/'+fileName, async (err) => {
        if (err) {
            throw err
        } else {
            await Users.updateOne({ _id: req.user._id }, { $set: { profile: null } })
            
        }
    });
    
    res.status(202)


}