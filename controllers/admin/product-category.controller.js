const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system");
const createTreeHelper = require('../../helpers/createTree');
// [GET] /admin/product-category
module.exports.index =  async(req, res) => {
  let find = {
    delete : false
  }

  const records = await ProductCategory.find(find);
  const newRecords = createTreeHelper.tree(records);
  res.render("admin/pages/product-category/index.pug", {
    pageTitle: "Trang danh mục sản phẩm",
    records : newRecords
})
}

// [GET] /admin/product-category/create
module.exports.create =  async(req, res) => {

  let find = {
    delete : false
  }

  const records = await ProductCategory.find(find);
  const newRecords = createTreeHelper.tree(records);
  res.render("admin/pages/product-category/create.pug", {
    pageTitle: "Tạo danh mục sản phẩm",
    records : newRecords
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

// [GET] /admin/product-category/edit/:"id"
module.exports.edit =  async(req, res) => {
  // console.log(req.params.id);
  try{
  const find = {
    delete : false,
    _id: req.params.id
  }
  const productCategory = await ProductCategory.findOne(find);
  
  // tiny mce parent_id
  const records = await ProductCategory.find({
    delete : false
  });
  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/product-category/edit", {
    pageTitle: "Chỉnh sửa danh mục sản phẩm ",
    productCategory: productCategory,
    records: newRecords
  });
  } catch(error){
    req.flash("error", "Đã xảy ra lỗi khi tìm kiếm danh mục sản phẩm!");
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  }
};

// [PATCH] /admin/products/edit/:"id"
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);
  try {
    await ProductCategory.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật danh mục sản phẩm thành công!"); 
  } catch (error) {
    req.flash("error", "Cập nhật danh mục sản phẩm thất bại!");
  }

  res.redirect("back");
};

