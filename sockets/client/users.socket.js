const User = require("../../models/user.model");

module.exports = (res) => {
  //Chuc nang yêu cầu kết bạn
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

  //Chức năng hủy gửi yêu cầu kết bạn
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id; //Id cua A
      // console.log(myUserId);
      // console.log(userId); // Id của B

      //Xóa Id A trong acceptFriends của B
      const existIdAinB =  await User.findOne({
        _id: userId,
        acceptFriends: myUserId
      });

      if(existIdAinB){
        await User.updateOne({
          _id: userId
        }, {
          $pull: {
            acceptFriends:myUserId
          }
        });
      }
      //Xóa Id B trong requestFriends của A
      const existIdBinA =  await User.findOne({
        _id: myUserId,
        requestFriends: userId //tim xem co id cua B trong danh sach cua a hay chua
      });

      if(existIdBinA){
        await User.updateOne({
          _id: myUserId
        }, {
          $pull: {
            requestFriends: userId
          }
        });
      }
    });

   //Chức năng từ chối kết bạn
   socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
    const myUserId = res.locals.user.id; //Id cua B
    // console.log(myUserId); IB của B
    // console.log(userId); // Id của A

    //Xóa Id A trong acceptFriends của B
    const existIdAinB =  await User.findOne({
      _id: myUserId,
      acceptFriends: userId
    });

    if(existIdAinB){
      await User.updateOne({
        _id: myUserId
      }, {
        $pull: {
          acceptFriends:userId
        }
      });
    }
    //Xóa Id B trong requestFriends của A
    const existIdBinA =  await User.findOne({
      _id: userId,
      requestFriends: myUserId //tim xem co id cua B trong danh sach cua a hay chua
    });

    if(existIdBinA){
      await User.updateOne({
        _id: userId
      }, {
        $pull: {
          requestFriends: myUserId
        }
      });
    }
  });
  });
}

