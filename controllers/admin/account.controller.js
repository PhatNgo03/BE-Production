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
  const accounts = await Account.findOne(find);
  const roles = await Role.find({
    delete: false,
  });
  res.render("admin/pages/accounts/edit", {
    pageTitle: "Chỉnh sửa tài khoản",
    accounts: accounts,
    roles: roles
  });
  } catch(error){
    req.flash("error", "Đã xảy ra lỗi khi chỉnh sửa tài khoản!");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] /admin/accounts/edit/:"id"
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  const emailExist = await Account.findOne({
    _id: {$ne: id}, //ne = not equal
    email: req.body.email,
    delete: false
  })
  if(emailExist){
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);
  }
  else {
    if(req.body.password){
      req.body.password = md5(req.body.password);
    }
    else {
      delete req.body.password;
    }
    try {
      await Account.updateOne({ _id: id }, req.body);
      req.flash("success", "Cập nhật tài khoản thành công!"); 
    } catch (error) {
      req.flash("error", "Cập nhật tài khoản thất bại!");
    }
  }
  res.redirect("back");
};
