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