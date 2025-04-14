const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
const md5 = require("md5");
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");
//  [GET] /user/register
module.exports.register = async(req, res) => {
  
  res.render("client/pages/user/register.pug", {
    pageTitle: "Đăng ký tài khoản",
  });
}

//  [GET] /user/registerPost
module.exports.registerPost = async(req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email
  });
  if(existEmail){
    req.flash("error", "Email đã tồn tại!");
    res.redirect("back");
    return;
  }
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/");
}

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login.pug", {
    pageTitle: "Đăng nhập",
  });
}

// [POST] /user/loginPost
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // const {email, password} = req.body;

  const user = await User.findOne({
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

  //check cart exist
  const cart = await Cart.findOne({
    user_id : user.id
  })
  
  if(cart){
    res.cookie("cartId", cart.id);
  } else {
    await Cart.updateOne(
      {
      _id: req.cookies.cartId
      },
      {
        user_id : user.id
      }
    )
  }
 
  res.cookie("tokenUser", user.tokenUser);
  
  await User.updateOne({
    tokenUser: user.tokenUser,
  }, 
  {
     statusOnline: "online"
  });

  //SERVER_RETURN_USER_ONLINE
  _io.once('connection', (socket) => {
    socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE",  {
      userId: user.id,
      status: "online"
    });
  });
  res.redirect("/");
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  await User.updateOne({
    tokenUser: req.cookies.tokenUser
  }, 
  {
     statusOnline: "offline"
  });
  //xoa token trong cookie
  res.clearCookie("tokenUser");
  res.clearCookie("cartId");
  res.redirect("/");
}

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu"
  });
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = generateHelper.generateRandomNumber(6);
  const user = await User.findOne({
    email : email,
    delete : false
  });

  if(!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }
  //Luu thong tin vào DB
  const objectForgotPassword = {
    email : email,
    otp: otp,
    expireAt: Date.now() + 180000
  }

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  //Neu ton tai email thi gui ma OTP qua email
  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `
    Mã OTP để lấy lại mật khẩu là :  <b>${otp}</b>. Thời hạn sử dụng là 3 phút. `
    
  sendMailHelper.sendMail(email, subject, html);
  res.redirect(`/user/password/otp?email=${email}`);


}

// [GET] /user/password/otp
module.exports.otpPassword =  async(req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password.pug", {
    pageTitle: "Nhập mã OTP",
    email : email
  });
}

// [POST] /user/password/otp
module.exports.otpPasswordPost =  async(req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if(!result){
    req.flash("error", "mã otp không hợp lệ!");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({
    email : email
  });
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/user/password/reset");
}


// [GET] /user/password/reset
module.exports.resetPassword =  async(req, res) => {
  res.render("client/pages/user/reset-password.pug", {
    pageTitle: "Đổi mật khẩu",
  });
}

// [POST] /user/password/reset
module.exports.resetPasswordPost =  async(req, res) => {

  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;
  
  await User.updateOne(
    {
      tokenUser : tokenUser
    },
    {
      password: md5(password)
    }
  )
  req.flash("success", "Đổi mật khẩu thành công!");
  res.redirect("/");
  
}

// [GET] /user/info
module.exports.info =  async(req, res) => {
  const tokenUser = req.cookies.tokenUser;

  const infoUser = await User.findOne({
    tokenUser : tokenUser
  }).select("-password");

  res.render("client/pages/user/info.pug", {
    pageTitle: "Thông tin tài khoản",
    infoUser: infoUser
  });
}

module.exports.editUser = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;
  const infoUser = await User.findOne({ tokenUser }).select("-password");

  res.render("client/pages/user/edit-user.pug", {
    pageTitle: "Chỉnh sửa thông tin",
    infoUser
  });
};

module.exports.updateUser = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;
  
  try {
    const updateData = {};

    if (req.body.fullName) updateData.fullName = req.body.fullName;
    if (req.body.phone) updateData.phone = req.body.phone;
    if (req.body.avatar) updateData.avatar = req.body.avatar;
    if (Object.keys(updateData).length > 0) {
      await User.updateOne({ tokenUser }, updateData);
      req.flash("success", "Cập nhật thông tin thành công!");
    } else {
      req.flash("error", "Không có dữ liệu để cập nhật!");
    }
  } catch (error) {
    req.flash("error", "Cập nhật thông tin thất bại!");
  }

  res.redirect("/user/info");
};
