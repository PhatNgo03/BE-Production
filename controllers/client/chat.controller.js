// const Chat = require("../../models/chat.model");
// const User = require("../../models/user.model");
// const RoomChat = require("../../models/rooms-chat.model"); 

// const chatSocket = require("../../sockets/client/chat.socket");
  
// // [GET] /chat/:roomChatId
// module.exports.index = async (req, res) => {
//   try {
//     const roomChatId = req.params.roomChatId;
//     const myId = res.locals.user.id;
//     // SOCKET IO
//       chatSocket(req, res);
//     // End SOCKET IO

    
//     // Lấy dữ liệu từ database
//     const chats = await Chat.find({ 
//       room_chat_id : roomChatId,
//       delete: false
//     });
//     for (const chat of chats) {
//       const infoUser = await User.findOne({ _id: chat.user_id }).select("fullName avatar");
//       chat.infoUser = infoUser;
//     }
//     const roomChat = await RoomChat.findOne({ 
//       _id: roomChatId, 
//       delete: false 
//     }).select("title users");
    
  
//   // Lấy thông tin avatar và fullName của tất cả user trong room
//   const userIds = roomChat.users.map(u => u.user_id);
//   // const usersInRoom = await User.find({ _id: { $in: userIds } }).select("fullName avatar");
//   //   if (!roomChat) {
//   //     return res.status(404).send("Phòng chat không tồn tại");
//   //   }
    
  
//     // Nếu roomChat.users không tồn tại hoặc không phải mảng thì fallback thành mảng rỗng
//     const users = Array.isArray(roomChat.users) ? roomChat.users : [];
//     // Lấy người dùng khác mình
//     const otherUsers = users.filter(u => u.user_id !== myId);
//     // // Tìm người còn lại (không phải mình)
//     // const otherUsers  = roomChat.users.find(u => u.user_id !== myId);
//     // Lấy thông tin avatar + fullName của từng người còn lại
//     const usersInRoom = [];
//     for (const user of otherUsers) {
//       const info = await User.findOne({ _id: user.user_id }).select("fullName avatar");
//       if (info) usersInRoom.push(info);
//     }
//     // Render giao diện chat
//     res.render("client/pages/chat/index.pug", {
//       pageTitle: `Phòng Chat`,
//       roomTitle: roomChat.title ,
//       usersInRoom: usersInRoom,
//       chats: chats
//     });
//   } catch (error) {
//     console.error("Error in Chat.index:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };


const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");

const chatSocket = require("../../sockets/client/chat.socket");

// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
  try {
    const roomChatId = req.params.roomChatId;
    const myId = res.locals.user.id;

    // SOCKET IO
    chatSocket(req, res);
    // End SOCKET IO

    // Lấy tất cả tin nhắn trong phòng
    const chats = await Chat.find({
      room_chat_id: roomChatId,
      delete: false
    });

    // Gắn thêm thông tin user cho từng chat
    for (const chat of chats) {
      const infoUser = await User.findOne({ _id: chat.user_id }).select("fullName avatar");
      chat.infoUser = infoUser;
    }

    // Lấy thông tin phòng chat
    const roomChat = await RoomChat.findOne({
      _id: roomChatId,
      delete: false
    }).select("title users");

    if (!roomChat) {
      return res.status(404).send("Phòng chat không tồn tại");
    }

    // Nếu không có users hoặc không phải array thì set rỗng
    const users = Array.isArray(roomChat.users) ? roomChat.users : [];

    let usersInRoom = [];

    if (users.length === 2) {
      // Trường hợp phòng có 2 người => chỉ lấy người còn lại
      const otherUser = users.find(u => String(u.user_id) !== String(myId));
      const info = await User.findOne({ _id: otherUser.user_id }).select("fullName avatar");
      if (info) {
        usersInRoom.push(info);
      }
    } else {
      // Trường hợp phòng có >= 3 người => lấy tất cả bao gồm mình
      for (const user of users) {
        const info = await User.findOne({ _id: user.user_id }).select("fullName avatar");
        if (info) {
          info.isCurrentUser = String(user.user_id) === String(myId); // Nếu cần đánh dấu trong pug
          usersInRoom.push(info);
        }
      }
    }

    // Render giao diện
    res.render("client/pages/chat/index.pug", {
      pageTitle: `Phòng Chat`,
      roomTitle: roomChat.title,
      usersInRoom: usersInRoom,
      chats: chats
    });

  } catch (error) {
    console.error("Error in Chat.index:", error);
    res.status(500).send("Internal Server Error");
  }
};
