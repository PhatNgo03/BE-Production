// [GET] /admin/products
const Product = require("../../models/product.model")

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");


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