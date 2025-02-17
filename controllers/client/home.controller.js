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
   const newProducts = productsHelper.priceNewProduct(productsFeatured);
    res.render("client/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        productsFeatured : newProducts
    })
}