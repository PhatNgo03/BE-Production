const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");
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

      //Lấy ra độ dài AcceptFriends của B và trả về cho B
      const infoUserB =  await User.findOne({
        _id : userId
      });
      const lengthAcceptFriends = infoUserB.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId : userId,
        lengthAcceptFriends: lengthAcceptFriends
      });

      //Lấy ra info A và trả về cho B
      const infoUserA  = await User.findOne({
        _id : myUserId
      }).select("id avatar fullName");

      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userId: userId,
        infoUserA: infoUserA
      })
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
       //Lấy ra độ dài AcceptFriends của B và trả về cho B
       const infoUserB =  await User.findOne({
        _id : userId
      });
      const lengthAcceptFriends = infoUserB.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId : userId,
        lengthAcceptFriends: lengthAcceptFriends
      });

      //Lay Id của A và trả về cho B
      socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
        userIdB: userId,
        userIdA: myUserId
      });
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
   //Chức năng chấp nhận kết bạn
   socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
    const myUserId = res.locals.user.id; //Id cua B
    // console.log(myUserId); IB của B
    // console.log(userId); // Id của A

    //Check exist 
    const existIdAinB =  await User.findOne({
      _id: myUserId,
      acceptFriends: userId //tim xem co id cua B trong danh sach chấp nhận cua a hay chua
    });

    const existIdBinA =  await User.findOne({
      _id: userId,
      requestFriends: myUserId //tim xem co id cua B trong danh sach yêu cầu cua a hay chua
    });
    //End check exist
    
    //Tạo phòng chat chung 

    let roomChat;

    if(existIdAinB && existIdBinA){
      const dataRoom = {
        typeRoom : "friend", 
        users: [
          {
            user_id : userId,
            role: "superAdmin"
          },
          {
            user_id : myUserId,
            role: "superAdmin"
          }
        ],
      };
      roomChat = new RoomChat(dataRoom);
      await roomChat.save();
    }
    // Kết thúc tạo phòng chat chung

    //Thêm {user_id, room_chat_id} của A vào friendList của B
    //Xóa Id A trong acceptFriends của B
    if(existIdAinB){
      await User.updateOne({
        _id: myUserId
      }, {
        $push: {
          friendList: {
            user_id : userId,
            room_chat_id: roomChat.id
          }
        },
        $pull: {
          acceptFriends:userId
        }
      });
    }

     //Thêm {user_id, room_chat_id} của B vào friendList của A
    //Xóa Id B trong requestFriends của A
   

    if(existIdBinA){
      await User.updateOne({
        _id: userId
      }, {
        $push: {
          friendList: {
            user_id : myUserId,
            room_chat_id: roomChat.id
          }
        },
        $pull: {
          requestFriends: myUserId
        }
      });
    }
    const infoUserB = await User.findOne({
      _id: myUserId
    }).select("id avatar fullName");
    socket.broadcast.emit("SERVER_REMOVE_ACCEPTED_USER_FROM_LIST", {
      userId: userId, //id A
      infoUserB: infoUserB
    });
  });

});
}

