const { getHashedPassword } = require('../../Hashing/hasingPassowrd');
const { createAccessToken } = require('../../adminStore/controlers/auth')
let User = require('../modals/Buyer')

exports.CreateUser = async (req, res) => {
    const { name, lastName, email, password } = req.body

    const hash = await getHashedPassword(password);

    let users = new User({ name, lastName, email, password: hash })

    try {
        let isExistingUser = await User.findOne({ email: email })
        if (!isExistingUser) {
            await users.save();
            let accessToken = createAccessToken(req, users)
            res.send({ buyerOrStore: 'buyer', accessToken })
        } else {
            res.status(409).send('Email is already taken')
        }
    } catch (error) {
        console.log('createUser', error.message);
        res.status(404).send(error.message)
    }
}

exports.getBuyerName = async (req, res) => {
    const { _id } = req.user
    let curLogedInUser = await User.findOne({ _id: _id })
    try {
        if (curLogedInUser) {

            res.send(curLogedInUser.name)
        } else {
            res.status(401).send({ err: 'user not found' })
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}



