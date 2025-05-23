const Product = require("../../models/product.model")
const Account = require("../../models/account.model")
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const createTreeHelper = require('../../helpers/createTree');
const ProductCategory = require("../../models/product-category.model")


// [GET] /admin/products
module.exports.index =  async(req, res) => {
  //filterStatus
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    delete : false
  }
  //statusProduct
  if(req.query.status){
    find.status = req.query.status;
  }

  //keyword search
  const objectSearch = searchHelper(req.query);
  // console.log(objectSearch);
  if(objectSearch.regex){
   find.title = objectSearch.regex;
  }


  //Pagination 
  const countProducts = await Product.countDocuments(find);
  //c2
  let objectPagination = paginationHelper(
    {
      currentPage : 1,
      limitItems: 4
    },
    req.query,
    countProducts
  )

  //Sort 
  let sort = {};

  if(req.query.sortKey && req.query.sortValue) {
     sort[req.query.sortKey] = req.query.sortValue;
  }else {
    sort.position = "desc";
  }

  //End sort
  
  const products = await Product.find(find)
  .sort(sort)
  .limit(objectPagination.limitItems).skip(objectPagination.skip);

  for(const product of products){
    //get info user created
    const user = await Account.findOne({
      _id : product.createdBy.account_id
    });

    if(user){
      product.accountFullName = user.fullName;
    }

    //get info user updated lasted
    // const updatedBy = product.updatedBy[product.updatedBy.length-1];
    const updatedBy = product.updatedBy.slice(-1)[0];
    if(updatedBy){
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id
      });
       updatedBy.accountFullName = userUpdated ? userUpdated.fullName : "admin";
    }
  }

  // console.log(products);
  res.render("admin/pages/products/index.pug", {
    pageTitle: "Trang danh sách sản phẩm",
    products : products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination : objectPagination
})
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  // console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }
  await Product.updateOne({ _id : id }, {
    status : status,
    $push:{
      updatedBy: updatedBy
    }
  });

  req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!');
  res.redirect("back");
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }
  switch(type){
    case "active":
      await Product.updateMany({_id : {$in: ids}}, {
        status: "active",
        $push:{ updatedBy: updatedBy }
       });
      req.flash('success', `Cập nhật trạng thái của ${ids.length} sản phẩm thành công!`);
      break;
    
    case "inactive":
      await Product.updateMany({_id : {$in: ids}}, {
        status: "inactive",
        $push:{ updatedBy: updatedBy }
      });
      req.flash('success', `Dừng trạng thái hoạt động của ${ids.length} sản phẩm thành công!`);
      break

    case "delete-all":
    await Product.updateMany(
      {
        _id : {$in: ids}
      },
      {
        delete: true,
        deletedBy : {
          account_id: res.locals.user.id,
          deletedAt: new Date()
        }
      });
    req.flash('success', `Xóa ${ids.length} sản phẩm thành công!`);
    break

    case "change-position":
      for(const item of ids){
        let[id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id}, {
          position : position,
          $push:{ updatedBy: updatedBy }
        });
        req.flash('success', `Đã thay đổi vị trí sản phẩm thành công!`);
      }
      break
    default:
      break;
  }
  
  res.redirect("back");
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({ _id : id });
  await Product.updateOne(
    {_id: id},
    {
      delete: true,
      deletedBy : {
        account_id: res.locals.user.id,
        deletedAt: new Date()
      }
    }, 
  );
  req.flash('success', `Đã xóa sản phẩm thành công!`);
  res.redirect("back");
}

// [GET] /admin/products/create
module.exports.create =  async(req, res) => {
  let find = {
    delete : false
  }

  const category = await ProductCategory.find(find);
  const newCategory = createTreeHelper.tree(category);
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm ",
    category:newCategory
  });
}

// [POST] /admin/products/create
module.exports.createPost =  async(req, res) => {
  // console.log(req.file);

  req.body.price= parseInt(req.body.price);
  req.body.discountPercentage= parseInt(req.body.discountPercentage);
  req.body.stock= parseInt(req.body.stock);

  if(req.body.position == ""){
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  }
  else{
    req.body.position= parseInt(req.body.position);
  }

  // if(req.file){
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }
  req.body.createdBy = {
    account_id: res.locals.user.id
  }
  const product = new Product(req.body);
  await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/edit/:"id"
module.exports.edit =  async(req, res) => {
  // console.log(req.params.id);
  try{
  const find = {
    delete : false,
    _id: req.params.id
  }
  const product = await Product.findOne(find);
  const category = await ProductCategory.find({
    delete : false
  });
  const newCategory = createTreeHelper.tree(category);
  res.render("admin/pages/products/edit", {
    pageTitle: "Chỉnh sửa sản phẩm ",
    product: product,
    category: newCategory
  });
  } catch(error){
    req.flash("error", "Đã xảy ra lỗi khi tìm kiếm sản phẩm!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:"id"
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  // if (req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }
    await Product.updateOne({ _id: id }, {
      ...req.body,
      $push:{
        updatedBy: updatedBy
      }
    });
    req.flash("success", "Cập nhật sản phẩm thành công!"); 
  } catch (error) {
    req.flash("error", "Cập nhật sản phẩm thất bại!");
  }

  res.redirect("back");
};


// [GET] /admin/products/detail/:"id"
module.exports.detail =  async(req, res) => {
  // console.log(req.params.id);
  try{
  const find = {
    delete : false,
    _id: req.params.id
  }
  const product = await Product.findOne(find);

  // console.log(product);
  if (!product) {
    req.flash("error", "Không tìm thấy sản phẩm!"); 
    return res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
  res.render("admin/pages/products/detail", {
    pageTitle: product.title,
    product: product,
  });
  } catch(error){
    req.flash("error", "Đã xảy ra lỗi khi tìm kiếm sản phẩm!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

