const Account = require("../../models/account.model");
const Role = require("../../models/role.model")
const systemConfig = require("../../config/system");
const md5 = require('md5');

// [GET] /admin/my-account/
module.exports.index = async (req, res) => {
  res.render("./admin/pages/my-account/index.pug", {
      pageTitle: "Thông tin cá nhân",
  })
}
// [GET] /admin/roles/edit"
module.exports.edit =  async(req, res) => {
  try{
  const find = {
    delete : false,
    _id: req.params.id
  }
  const accounts = await Account.findOne(find);
  const roles = await Role.find({
    delete: false,
  });
  res.render("admin/pages/my-account/edit.pug", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
    accounts: accounts,
    roles: roles
  });
  } catch(error){
    req.flash("error", "Đã xảy ra lỗi khi chỉnh sửa tài khoản!");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};



// [PATCH] /admin/my-account/edit"
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id;
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
