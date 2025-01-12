const Product = require("../../models/product.model")
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
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
  //c1:
  // if(req.query.page){
  //   objectPagination.currentPage = parseInt(req.query.page);
  // }
  // objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
  // const countProducts = await Product.countDocuments(find);
  // const totalPage = Math.ceil(countProducts/objectPagination.limitItems);
  // objectPagination.totalPage = totalPage;
  // End Pagination 


  const products = await Product.find(find)
  .sort({position : "desc"})
  .limit(objectPagination.limitItems).skip(objectPagination.skip);
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

  await Product.updateOne({ _id : id }, {status : status});

  req.flash('success', 'Cập nhật trạng thái sản phẩm thành công!');
  res.redirect("back");
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch(type){
    case "active":
      await Product.updateMany({_id : {$in: ids}}, {status: "active"});
      req.flash('success', `Cập nhật trạng thái của ${ids.length} sản phẩm thành công!`);
      break;
    
    case "inactive":
      await Product.updateMany({_id : {$in: ids}}, {status: "inactive"});
      req.flash('success', `Dừng trạng thái hoạt động của ${ids.length} sản phẩm thành công!`);
      break

    case "delete-all":
    await Product.updateMany({_id : {$in: ids}}, {delete: true, deletedAt: new Date()});
    req.flash('success', `Xóa ${ids.length} sản phẩm thành công!`);
    break

    case "change-position":
      for(const item of ids){
        let[id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id}, {position : position});
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
    {_id: id}, {delete: true, deletedAt: new Date()}, 
  );
  req.flash('success', `Đã xóa sản phẩm thành công!`);
  res.redirect("back");
}



// [GET] /admin/products/create
module.exports.create =  async(req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm ",
  });
}

// [POST] /admin/products/create
module.exports.createPost =  async(req, res) => {
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
  const product = new Product(req.body);
  await product.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`);
}