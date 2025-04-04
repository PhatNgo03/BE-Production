
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
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
  if(listBtnCancelFriend.length > 0){
    listBtnCancelFriend.forEach(button => {
      button.addEventListener("click", () => {
      button.closest(".box-user").classList.remove("add");
        const userId =  button.getAttribute("btn-cancel-friend"); //get id

        socket.emit("CLIENT_CANCEL_FRIEND", userId);
      });
    });
  }
//End Function cancel request add friend