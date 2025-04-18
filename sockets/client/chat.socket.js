const uploadToCloudinary = require("../../helpers/uploadToCloudinary");
const Chat = require("../../models/chat.model");

module.exports = (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  const roomChatId = req.params.roomChatId;
  _io.once('connection', (socket) => { 
    //check some room
    socket.join(roomChatId);

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
          room_chat_id: roomChatId,
          content: data.content,
          images: images
        });
        await chat.save();
        
        // Trả về dữ liệu cho client
        _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
          userId: userId,
          fullName: fullName,
          content: data.content,
          images: images
        });
      } catch (err) {
        console.error("Error in CLIENT_SEND_MESSAGE:", err);
      }
    });
      //Typing 
    socket.on("CLIENT_SEND_TYPING", async (type) => {
      try {
        socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
          userId: userId,
          fullName: fullName,
          type: type 
        });
      } catch (err) {
        console.error("Error in CLIENT_SEND_TYPING:", err);
      }
    });
  });
}