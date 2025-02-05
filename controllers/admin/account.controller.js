const Account = require("../../models/account.model");
const Role = require("../../models/role.model")
const systemConfig = require("../../config/system");
const md5 = require('md5');
// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    delete :false
  }
  const records = await Account.find(find).select("-password -token");

  for (const record of records){
    const role = await Role.findOne({
      _id: record.role_id,
      delete: false
    });
    record.role = role;
  }
  res.render("./admin/pages/accounts/index.pug", {
      pageTitle: "Danh sách tài khoản",
      records : records
  })
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {

  const roles = await Role.find({
    delete :false
  })
  res.render("./admin/pages/accounts/create.pug", {
      pageTitle: "Tạo mới tài khoản",
      roles: roles
  })
}

// [GET] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExist = await Account.findOne({
    email: req.body.email,
    delete: false
  })
  if(emailExist){
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);
    res.redirect("back");
  }
  else {
    req.body.password = md5(req.body.password)
    const record = new Account(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
  
}


// [GET] /admin/roles/edit/:"id"
module.exports.edit =  async(req, res) => {
  // console.log(req.params.id);
  try{
  const find = {
    delete : false,
    _id: req.params.id
  }
  const roles = await Role.findOne(find);

  res.render("admin/pages/roles/edit", {
    pageTitle: "Chỉnh sửa nhóm quyền",
    roles: roles,
  });
  } catch(error){
    req.flash("error", "Đã xảy ra lỗi khi tìm kiếm danh mục sản phẩm!");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH] /admin/products/edit/:"id"
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  try {
    await Role.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật danh mục sản phẩm thành công!"); 
  } catch (error) {
    req.flash("error", "Cập nhật danh mục sản phẩm thất bại!");
  }

  res.redirect("back");
};

// [Get] /admin/roles/permission"
module.exports.permissions = async (req, res) => {
  let find = {
    delete :false 
  }
  const records = await Role.find(find);
  res.render("admin/pages/roles/permissions", {
    pageTitle: "Phân quyền",
    records: records,
  });
};

// [PATCH] /admin/roles/permissionsPatch"
module.exports.permissionsPatch = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions);
  try{
    for(const item of permissions){
      await Role.updateOne({_id: item.id}, {permissions: item.permissions})
    }
    req.flash("success", "Cập nhật phân quyền thành công!"); 
    res.redirect("back");
  }
  catch(error){
    req.flash("error", "Cập nhật phân quyền thất bại!");
  }
};