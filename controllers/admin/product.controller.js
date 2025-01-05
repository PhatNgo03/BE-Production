// [GET] /admin/products
const Product = require("../../models/product.model")
module.exports.index =  async(req, res) => {


  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: ""
    },
    {
      name: "Hoạt động",
      status: "active",
      class: ""
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: ""
    }
  ]
  // console.log(req.query.status);
  let find = {
    delete : false
  }

  //filterStatus
  if(req.query.status){
    const index = filterStatus.findIndex(item => item.status == req.query.status); //Tim index status == status click
    filterStatus[index].class = "active";
  }else{
    const index = filterStatus.findIndex(item => item.status == ""); //Tim index status == status click
    filterStatus[index].class = "active";
  }

  //statusProduct
  if(req.query.status){
    find.status = req.query.status;
  }

  const products = await Product.find(find)
  // console.log(products);
  res.render("admin/pages/products/index.pug", {
    pageTitle: "Trang danh sách sản phẩm",
    products : products,
    filterStatus: filterStatus
})
}