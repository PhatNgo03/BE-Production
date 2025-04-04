const User =require("../../models/user.model");
const usersSocket = require("../../sockets/client/users.socket");

//  [GET] /users/not-friend
module.exports.notFriend = async(req, res) => {
  // SOCKET IO
    usersSocket(res);
  // End SOCKET IO

  const userId = res.locals.user.id;

  const myUser= await User.findOne({
    _id: userId,
  });

  const requestFriends = myUser.requestFriends; // danh sach nhung nguoi gui yeu cau ket ban
  const acceptFriends = myUser.acceptFriends; // danh sach nhung nguoi ket ban

  const users = await User.find({
    $and: [
      { _id: {$ne: userId} }, //not equal loai tru 1 ptu
      { _id: {$nin: requestFriends} },//not in loại  tru 1 mang
      { _id: {$nin: acceptFriends} } //not in loại  tru 1 mang 
    ],
    status: "active",
    delete: false
  }).select("id avatar fullName");

  res.render("client/pages/users/not-friend.pug", {
    pageTitle: "Danh sách người dùng",
    users: users
  });
}


//  [GET] /users/request
module.exports.request = async(req, res) => {
   // SOCKET IO
   usersSocket(res);
   // End SOCKET IO
 
   const userId = res.locals.user.id;
 
   const myUser= await User.findOne({
     _id: userId,
   });
 
   const requestFriends = myUser.requestFriends; // danh sach nhung nguoi gui yeu cau ket ban
   const acceptFriends = myUser.acceptFriends; // danh sach nhung nguoi ket ban
 
   const users = await User.find({
     _id: {$in: requestFriends} ,//not in loại  tru 1 mang
     status: "active",
     delete: false
   }).select("id avatar fullName");
 
  res.render("client/pages/users/request.pug", {
    pageTitle: "Lời mời đã gửi",
    users: users
  });
}
