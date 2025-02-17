const Product = require("../../models/product.model");
const productsHelper =require("../../helpers/product");
// / [GET] /
module.exports.index = async(req, res) => {
    //Get product featured
    const productsFeatured = await Product.find({
        featured: "1",
        delete: false,
        status: "active"
    }).limit(6);
    const newProductsFeatured = productsHelper.priceNewProduct(productsFeatured);

    //get latest product list item
    const productsNew = await Product.find({
        delete: false,
        status: "active"
    }).sort({position: "desc"}).limit(6);
   const newProductsNew = productsHelper.priceNewProduct(productsNew);

    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        productsFeatured : newProductsFeatured,
        productsNew: newProductsNew
    })


}