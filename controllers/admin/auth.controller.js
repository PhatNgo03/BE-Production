const Account = require("../../models/account.model");
const Role = require("../../models/role.model")
const systemConfig = require("../../config/system");
const md5 = require('md5');

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  if(req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
  }else {
    res.render("./admin/pages/auth/login.pug", {
      pageTitle: "Đăng nhập",
  });
  }
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

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
  //xoa token trong cookie
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}
