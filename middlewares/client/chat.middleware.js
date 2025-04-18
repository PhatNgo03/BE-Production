const RoomChat = require("../../models/rooms-chat.model");

module.exports.isAccess = async (req, res, next) => {
  try {
    const roomChatId = req.params.roomChatId;
    const userId = res.locals.user.id;

    const existUserInRoomChat = await RoomChat.findOne({
      _id: roomChatId,
      "users.user_id" : userId,
      delete: false 
    });
    
    if(existUserInRoomChat){
      next();
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error chat", error);
  }
};
