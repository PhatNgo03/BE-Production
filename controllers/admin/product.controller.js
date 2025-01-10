const Product = require("../../models/product.model")
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

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


  const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);
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

  res.redirect("back");
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch(type){
    case "active":
      await Product.updateMany({_id : {$in: ids}}, {status: "active"});
      break;
    
    case "inactive":
      await Product.updateMany({_id : {$in: ids}}, {status: "inactive"});
      break
    case "delete-all":
    await Product.updateMany({_id : {$in: ids}}, {delete: true, deletedAt: new Date()});
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
  res.redirect("back");
}
