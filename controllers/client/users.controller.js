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
  const friendList = (myUser.friendList || []).map(({ user_id }) => user_id); // danh sach nhung nguoi da la ban
  const users = await User.find({
    $and: [
      { _id: {$ne: userId} }, //not equal loai tru 1 ptu
      { _id: {$nin: requestFriends} },//not in loại  tru 1 mang
      { _id: {$nin: acceptFriends} },
      { _id: {$nin: friendList} } //not in loại  tru 1 mang 
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



//  [GET] /users/accept
module.exports.accept = async(req, res) => {
  // SOCKET IO
  usersSocket(res);
  // End SOCKET IO

  const userId = res.locals.user.id;

  const myUser= await User.findOne({
    _id: userId,
  });

  const acceptFriends = myUser.acceptFriends; // danh sach nhung nguoi ket ban

  const users = await User.find({
    _id: {$in: acceptFriends} ,
    status: "active",
    delete: false
  }).select("id avatar fullName");

 res.render("client/pages/users/accept.pug", {
   pageTitle: "Lời mời kết bạn",
   users: users
 });
}


//  [GET] /users/friends
module.exports.friends = async(req, res) => {
  // SOCKET IO
  usersSocket(res);
  // End SOCKET IO

  const userId = res.locals.user.id;

  const myUser= await User.findOne({
    _id: userId,
  });

  const friendList = myUser.friendList; // danh sach nhung nguoi ket ban
  const friendListId = friendList.map(item => item.user_id);
  const users = await User.find({
    _id: {$in: friendListId} ,
    status: "active",
    delete: false
  }).select("id avatar fullName statusOnline");
  //Tim Thông tin cua nguoi đã là bạn bè
  for (const user of users) {
    const infoFriend = friendList.find(friend => friend.user_id === user.id);
    user.infoFriend = infoFriend;
  }
 res.render("client/pages/users/friends.pug", {
   pageTitle: "Danh sách bạn bè",
   users: users
 });
}
