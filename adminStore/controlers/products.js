let Products = require('../modals/productsModal');
const Purchases = require('../modals/sales');
let Users = require('../modals/store');


exports.createProduct = async (req, res) => {
    console.log(req.body, 'body');
    const { _id } = req.user
    const { productName, quantity, cost, price } = req.body;
    let isProdExisting = await Products.findOne({ productName: productName, userId: _id })
    
    try {
        if (req.body._id ) {
            await Products.findOneAndUpdate(
                { _id: req.body._id },
                { $set: { productName, quantity, cost, price, userId: req.body.userId } }
            )
            
             res.status(201).send('Updeted Successfully')
        }
        else if (!isProdExisting) {

            let product = new Products({ productName, quantity, cost, price, userId: _id })
            let result = await product.save();
            let user = await Users.findById(_id)
            user.set({ products: [...user.products, { productId: result._id }] }).save()
            res.status(201).send(result)


        } else {
            return res.status(401).send('Product Already Exisits')
        }

    } catch (error) {
        console.log(error.message, 'mesaage');
        res.status(400).send(error)
    }

}





exports.getProducts = async (req, res) => {
    let userId = req.user ?._id || req.params?.storeId
    try {
        let data = await Products.find({ userId: userId })
        if (data) {
            res.send(data);
        } else {
            res.status(204)
        }
    } catch (error) {
        res.status(204).send(error.message)
    }
}

exports.deleteProduct = async (req, res) => {
    let { id } = req.params;
    const { _id } = req.user
    let isProd;
    try {

        isProd = await Products.findOneAndRemove({ _id: id })
        await Purchases.deleteMany({ product: id })
        await Users.updateOne({ _id: _id }, { $pull: { products: { productId: id } } });
        let prodsAfterDelete = await Products.find({ userId: _id })
        res.status(202).send(prodsAfterDelete);



    } catch (error) {
        let code = isProd ? 406 : null
        res.status(code || 404).send(error.message)

    }



}



// exports.editProduct = async (req, res) => {
    // let { id } = req.params;

    // let productId = req.body.productId
    // const { productName, quantity, cost, price } = req.body;
    // let product = await Products.findById(productId)
    // product.productName = productName
    // product.quantity = quantity
    // product.cost = cost
    // product.price = price

    // return product.save()

    //    let editedProducts = Products.replaceOne()
    //     let data = product.editProductById(id);

    // res.send(editedProducts)

// }
// exports.createProduct = async (req, res) => {

//     const userId = req.body.userId
//     let products = new Products()

//     let prooductsParsedData = await products.readProductsFile()
//     let users = new Users()


//     if (prooductsParsedData.length) {
//         let productId = products.writeProductsFile(req, res, prooductsParsedData)
//         req.body?.id ? null :
//             users.updateUserWithProducts(userId, productId)

//     } else {
//         let productId = products.writeProductsFile(req, res)
//         users.updateUserWithProducts(userId, productId)
//     }

// }

// exports.getProducts = (req, res) => {
//     let userId = req.params
//     let products = new Products()
//     let data = products.getProducts(userId.userId)
//     res.send(data);
// }

// exports.deleteProduct = (req, res) => {
//     console.log(req.params);
//     let { id } = req.params
//     let product = new Products();
//     let buyers = new BuyerInfo();
//     let data = product.deleteProductById(res, id);
//     buyers.removeBuyerOfADeletedProduct(id)
//     res.send(data);


// }

// exports.editProduct = (req, res) => {
//     let { id } = req.params;
//     let product = new Products();
//     let data = product.editProductById(id);

//     res.send(data)

// }