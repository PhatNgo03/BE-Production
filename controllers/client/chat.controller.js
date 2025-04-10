const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

const chatSocket = require("../../sockets/client/chat.socket");

// [GET] /chat/
module.exports.index = async (req, res) => {
  try {

    
    // SOCKET IO
      chatSocket(res);
    // End SOCKET IO

    // Lấy dữ liệu từ database
    const chats = await Chat.find({ delete: false });
    for (const chat of chats) {
      const infoUser = await User.findOne({ _id: chat.user_id }).select("fullName avatar");
      chat.infoUser = infoUser;
    }

    // Render giao diện chat
    res.render("client/pages/chat/index.pug", {
      pageTitle: "Chat",
      chats: chats
    });
  } catch (error) {
    console.error("Error in Chat.index:", error);
    res.status(500).send("Internal Server Error");
  }
};
