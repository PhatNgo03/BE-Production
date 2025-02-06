const Account = require("../../models/account.model");
const Role = require("../../models/role.model")
const systemConfig = require("../../config/system");
const md5 = require('md5');

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  res.render("./admin/pages/auth/login.pug", {
      pageTitle: "Đăng nhập",
  })
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // const {email, password} = req.body;

  const user = await Account.findOne({
    email: email,
    delete : false
  });
  if(!user) {
    req.flash("error", "Email hoặc mật khẩu không hợp lệ!");
    res.redirect("back");
    return;
  }
  if(md5(password) != user.password){
    req.flash("error", "Email hoặc mật khẩu không hợp lệ!");
    res.redirect("back");
    return;
  }
  if(user.status == "inactive"){
    req.flash("error", "Tài khoản đã bị khóa");
    res.redirect("back");
    return;
  }
  res.cookie("token", user.token)
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
 
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
    const id = req.params.id;
    try {
      await Account.updateOne({ _id: id }, req.body);
      req.flash("success", "Cập nhật tài khoản thành công!"); 
    } catch (error) {
      req.flash("error", "Cập nhật tài khoản thất bại!");
    }
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