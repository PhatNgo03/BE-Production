const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  if(!req.cookies.tokenUser){
    res.redirect(`/user/login`);
  }
  else {
    const user = await User.findOne({tokenUser : req.cookies.tokenUser }).select("-password");
    if(!user){
      res.redirect(`/user/login`);
    }else {
      res.locals.user = user;
      // //SERVER_RETURN_USER_ONLINE
      _io.on('connection', async (socket) => {
            const token = socket.handshake.headers.cookie?.split(';')
              .find(c => c.trim().startsWith('tokenUser='))
              ?.split('=')[1];
          
            if (!token) return;
          
            const user = await User.findOne({ tokenUser: token });
          
            if (!user) return;
          
            // Đánh dấu online
            await User.updateOne({ _id: user._id }, { statusOnline: "online" });
          
            socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
              userId: user.id,
              status: "online"
            });
          
            // Khi ngắt kết nối
            socket.on("disconnect", async () => {
              await User.updateOne({ _id: user._id }, { statusOnline: "offline" });
          
              socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
                userId: user.id,
                status: "offline"
              });
            });
          });
          
      next();
    }
  }
}