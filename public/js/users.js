
// Function send request add friend
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
  if(listBtnAddFriend.length > 0){
    listBtnAddFriend.forEach(button => {
      button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add");
        const userId =  button.getAttribute("btn-add-friend"); //get id

        socket.emit("CLIENT_ADD_FRIEND", userId);
      });
    });
  }
//End Function send request add friend


// Function cancel request add friend
const refuseFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.remove("add");
      const userId =  button.getAttribute("btn-cancel-friend"); //get id
      socket.emit("CLIENT_CANCEL_FRIEND", userId);
  });
};
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
  if(listBtnCancelFriend.length > 0){
    listBtnCancelFriend.forEach(button => {
      refuseFriend(button);
    });
  }
//End Function cancel request add friend


// Function refuse add friend received
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
  if(listBtnRefuseFriend.length > 0){
    listBtnRefuseFriend.forEach(button => {
      button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("refuse");
        const userId =  button.getAttribute("btn-refuse-friend"); //get id

        socket.emit("CLIENT_REFUSE_FRIEND", userId);
      });
    });
  }
//End Function invitation received

// Function accepted friend
const  acceptFriends = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("accepted");
      const userId =  button.getAttribute("btn-accept-friend"); //get id

      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
  });
}
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
  if(listBtnAcceptFriend.length > 0){
    listBtnAcceptFriend.forEach(button => {
      acceptFriends(button);
    });
  }
//End Function invitation received

 //SERVER_RETURN_LENGTH_ACCEPT_FRIEND
 const badgeUsersAccept = document.querySelector("[badge-users-accept]");
 if(badgeUsersAccept){
  const userId = badgeUsersAccept.getAttribute("badge-users-accept");
  socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
    if(userId === data.userId){
      badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
    }
  });
 }

//End SERVER_RETURN_LENGTH_ACCEPT_FRIEND

//SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  //Logic trang lời mời đã nhận
  const dataUsersAccept = document.querySelector("[data-users-accept]"); 
  if(dataUsersAccept){
    const userId = dataUsersAccept.getAttribute("data-users-accept");
    if(userId === data.userId){
      //Vẽ user vừa kết bạn ra giao diện
      const div  = document.createElement("div");
      div.classList.add("col-4");
      div.setAttribute("user-id", data.infoUserA._id);
      div.innerHTML =  `
        <div class="box-user">
          <div class="inner-avatar">
            <img src=${data.infoUserA.avatar} alt=${data.infoUserA.fullName}>\
          </div>
          <div class="inner-info">
            <div class="inner-name">
              ${data.infoUserA.fullName}
            </div>
            <div class="inner-buttons">
            <button 
              class="btn btn-sm btn-primary mx-1" 
              btn-accept-friend=${data.infoUserA._id}
            >
              Chấp nhận
            </button>
            <button 
              class="btn btn-sm btn-secondary mx-1" 
              btn-refuse-friend=${data.infoUserA._id}
            >
              Xóa
            </button>
            <button 
              class="btn btn-sm btn-secondary mx-1" 
              btn-deleted-friend="" disabled=""
            >
              Đã xóa
            </button>
            <button 
              class="btn btn-sm btn-primary mx-1" 
              btn-accepted-friend="" disabled=""
            >
              Đã chấp nhận 
            </button>
          </div>
          </div>
        </div>
      `;
    
      dataUsersAccept.appendChild(div);
      //Hết vẽ user vừa kết bạn ra giao diện
      
      //Chấp nhận lời mời kết bạn
      const buttonAccept= div.querySelector("[btn-accept-friend]");
      acceptFriends(buttonAccept);
      //Hết chấp nhận lời mời kết bạn
    
      //Hủy lời mời kết bạn
      const buttonRefuse = div.querySelector("[btn-refuse-friend]");
      refuseFriend(buttonRefuse);
      //Hết hủy lời mời kết bạn
    }
  }

  //Trang danh sách người dùng
  const dataUsersNotFriend = document.querySelector("[data-users-not-friend]"); //get list friend
  if(dataUsersNotFriend){
    const userId = dataUsersNotFriend.getAttribute("data-users-not-friend"); //get id B
    if(userId === data.userId){
      const boxUserRemove = dataUsersNotFriend.querySelector(`[user-id='${data.infoUserA._id}']`); // tim A trong danh sách bạn của B

      if(boxUserRemove) {
        dataUsersNotFriend.removeChild(boxUserRemove);
        }
      }
    }
});

// Khi server thông báo B đã chấp nhận, xóa B khỏi danh sách người dùng của A
socket.on("SERVER_REMOVE_ACCEPTED_USER_FROM_LIST", (data) => {
  const dataUsersNotFriend = document.querySelector("[data-users-not-friend]");
  if (dataUsersNotFriend) {
    const userId = dataUsersNotFriend.getAttribute("data-users-not-friend");
    if (userId === data.userId) {
      const boxUserRemove = dataUsersNotFriend.querySelector(`[user-id='${data.infoUserB._id}']`);
      if (boxUserRemove) {
        dataUsersNotFriend.removeChild(boxUserRemove);
      }
    }
  }
});

//End SERVER_RETURN_INFO_ACCEPT_FRIEND

//SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
  const userIdA = data.userIdA;
  const boxUserRemove = document.querySelector(`[user-id='${userIdA}']`);

  if(boxUserRemove) {
    const dataUsersAccept = document.querySelector("[data-users-accept]"); 
    const userIdB = badgeUsersAccept.getAttribute("badge-users-accept");
    if(userIdB == data.userIdB){
      dataUsersAccept.removeChild(boxUserRemove);
    }
  }
});
//End SERVER_RETURN_USER_ID_CANCEL_FRIEND