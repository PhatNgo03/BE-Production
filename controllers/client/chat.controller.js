const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

// [GET] /chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  //SOCKET IO
  _io.once('connection', (socket) => { 
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      //Luu vao db
      const chat = new Chat ({
        user_id : userId,
        content : content
      });
      await chat.save();
  //response data to client
    _io.emit("SERVER_RETURN_MESSAGE", {
      userId: userId,
      fullName: fullName,
      content: content 
    });
  });
  // Typing
  socket.on("CLIENT_SEND_TYPING", async (type) => {
    socket.broadcast.emit("SERVER_RETURN_TYPING", {
      userId: userId,
      fullName: fullName,
      type: type 
    });
  });
});
  //End SOCKET IO

  //Get data from db
  const chats = await Chat.find({
    delete: false
  });

  for(const chat of chats ){
    const infoUser = await User.findOne({
      _id : chat.user_id
    }).select("fullName avatar");

    chat.infoUser = infoUser;
  }
  //End get data from db
  res.render("client/pages/chat/index.pug", {
    pageTitle: "Chat",
    chats: chats
  })
}