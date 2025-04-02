const User = require("../../models/user.model");

module.exports = (res) => {
  _io.once('connection', (socket) => { 
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id; //Id cua A
      // console.log(myUserId);
      // console.log(userId); // Id của B

      //Them Id A vào acceptFriends của B
      const existIdAinB =  await User.findOne({
        _id: userId,
        acceptFriends: myUserId
      });

      if(!existIdAinB){
        await User.updateOne({
          _id: userId
        }, {
          $push: {
            acceptFriends:myUserId
          }
        });
      }
      //Them Id B vào requestFriends của A
      const existIdBinA =  await User.findOne({
        _id: myUserId,
        requestFriends: userId //tim xem co id cua B trong danh sach cua a hay chua
      });

      if(!existIdBinA){
        await User.updateOne({
          _id: myUserId
        }, {
          $push: {
            requestFriends: userId
          }
        });
      }
    });
  });
}

