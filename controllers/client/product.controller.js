// [GET] /products
const Product = require("../../models/product.model")

module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        delete: false
    });

    // products.forEach(item => {
    //     item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
    // })

    const newProduct = products.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
        return item;
    })
    console.log(products);
    res.render("client/pages/products/product.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: newProduct
    })
}