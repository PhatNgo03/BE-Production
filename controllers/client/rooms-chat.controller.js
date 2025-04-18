const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");
//  [GET] /rooms-chat/
module.exports.index = async (req, res) => {
  res.render("client/pages/rooms-chat/index.pug", {
    pageTitle: "Danh sách phòng"
  });
}

//  [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendList = res.locals.user.friendList;

  for(const friend of friendList) {
    const infoFriend = await User.findOne({
      _id: friend.user_id,
      delete: false
    }).select("fullName avatar");

    friend.infoFriend = infoFriend;
  }
  console.log(friendList);
  res.render("client/pages/rooms-chat/create.pug", {
    pageTitle: "Tạo phòng",
    friendList: friendList
  });
}

//  [POST] /rooms-chat/createPost
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  const usersId = req.body.usersId;

  const dataRoom = {
    title: title,
    typeRoom : "group",
    users: []
  };
  //them cac fiends vao room
  for (const userId of usersId) {
    dataRoom.users.push({
      user_id : userId,
      role: "user"
    });
  }

  dataRoom.users.push({
    user_id: res.locals.user.id,
    role: "superAdmin"
  })
  // console.log(dataRoom);
  const roomChat = new RoomChat(dataRoom);
  await roomChat.save();
  
  res.redirect(`/chat/${roomChat.id}`);
}
