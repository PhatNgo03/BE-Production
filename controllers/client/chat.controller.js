const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

// [GET] /chat/
module.exports.index = async (req, res) => {
  try {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    
    // SOCKET IO
    _io.once('connection', (socket) => { 
      socket.on("CLIENT_SEND_MESSAGE", async (data) => {
        try {
          let images = [];
          if (data.images && Array.isArray(data.images)) {
            for (const imageBuffer of data.images) {
              const link = await uploadToCloudinary(imageBuffer);
              images.push(link);
            }
          }
          // Lưu vào database
          const chat = new Chat({
            user_id: userId,
            content: data.content,
            images: images
          });
          await chat.save();
          
          // Gửi dữ liệu cho client
          _io.emit("SERVER_RETURN_MESSAGE", {
            userId: userId,
            fullName: fullName,
            content: data.content,
            images: images
          });
        } catch (err) {
          console.error("Error in CLIENT_SEND_MESSAGE:", err);
        }
      });
      
      socket.on("CLIENT_SEND_TYPING", async (type) => {
        try {
          socket.broadcast.emit("SERVER_RETURN_TYPING", {
            userId: userId,
            fullName: fullName,
            type: type 
          });
        } catch (err) {
          console.error("Error in CLIENT_SEND_TYPING:", err);
        }
      });
    });
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
