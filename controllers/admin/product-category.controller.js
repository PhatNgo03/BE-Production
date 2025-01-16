const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system");

// [GET] /admin/product-category
module.exports.index =  async(req, res) => {
  let find = {
    delete : false
  }
  const records = await ProductCategory.find(find);

  res.render("admin/pages/product-category/index.pug", {
    pageTitle: "Trang danh mục sản phẩm",
    records : records
})
}

// [GET] /admin/product-category/create
module.exports.create =  async(req, res) => {
  res.render("admin/pages/product-category/create.pug", {
    pageTitle: "Tạo danh mục sản phẩm",
})
}
// [POST] /admin/products/create
module.exports.createPost =  async(req, res) => {
  if(req.body.position == ""){
    const count= await ProductCategory.countDocuments();
    req.body.position = count + 1;
  }
  else{
    req.body.position= parseInt(req.body.position);
  }
  const record = new ProductCategory(req.body);
  await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);

}
 
