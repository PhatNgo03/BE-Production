module.exports.loginPost = (req, res, next) => {
  if(!req.body.email){
    req.flash("error", 'Vui lòng nhập email!');
    res.redirect("back");
    return;
  }
  if(!req.body.password){
    req.flash("error", 'Vui lòng nhập mật khẩu!');
    res.redirect("back");
    return;
  }
 
  next();
  // if(req.body.title.length < 8){
  //   req.flash("error", 'Vui lòng nhập tiêu đề ít nhất 8 kí tự! ');
  //   res.redirect("back");
  //   return;
  // }
}