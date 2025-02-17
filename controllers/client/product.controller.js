const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const productsHelper = require("../../helpers/product");
const productsCategoryHelper = require("../../helpers/product-category");
// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        delete: false
    })
    .sort({position : "desc"});

    // products.forEach(item => {
    //     item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
    // })
   const newProducts = productsHelper.priceNewProduct(products);
    // console.log(products);
    res.render("client/pages/products/product.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    })
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    try{
        const find = {
          delete : false,
          slug: req.params.slug,
          status: "active"
        }
        const product = await Product.findOne(find);
      
        // console.log(product);
        res.render("client/pages/products/detail", {
          pageTitle: product.title,
          product: product,
        });
        } catch(error){
          req.flash("error", "Đã xảy ra lỗi khi tìm kiếm sản phẩm!");
          res.redirect(`/products`);
        }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  try{
    const category = await ProductCategory.findOne({
      slug : req.params.slugCategory,
      delete: false
    });

    const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);

    const listSubCategoryId = listSubCategory.map(item => item.id);

    const products = await Product.find({
      product_category_id : { $in: [category.id, ...listSubCategoryId]},
      delete: false,
    }).sort({position:"desc"});
    const newProducts = productsHelper.priceNewProduct(products);

    res.render("client/pages/products/product", {
      pageTitle: category.title,
      products: newProducts,
    });
  } catch(error){
    req.flash("error", "Đã xảy ra lỗi!");
    res.redirect(`/products`);
  }
}