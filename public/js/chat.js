import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js';
// file-upload-with-preview
    const upload = new FileUploadWithPreview.FileUploadWithPreview("upload-images", { multiple: true, maxFileCount: 6 });
// end file-upload-with-preview


//CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if(formSendData){
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    const images = upload.cachedFileArray;

    console.log(images);

    if(content || images.length > 0) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content,
        images: images
      });
      e.target.elements.content.value = "";
      upload.resetPreviewPanel(); //clear all selected images
      socket.emit("CLIENT_SEND_TYPING", "hidden");
      // Ẩn popup emoji khi gửi tin
      const tooltip = document.querySelector(".tooltip");
      if (tooltip) {
        tooltip.classList.remove("shown");
      }
    }
  });
}
//End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");
  const boxTyping = document.querySelector(".chat .inner-list-typing");

  const div = document.createElement("div");

  let htmlFullName = "";
  let htmlContent = "";
  let htmlImages = "";

  if(myId === data.userId) {
    div.classList.add("inner-outgoing");
  } else{
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`
    div.classList.add("inner-incoming");
  }

  if(data.content)  {
    htmlContent = `
      <div class="inner-content">${data.content}</div>
    `;
  }
  
  if(data.images.length > 0)  {
    htmlImages += `<div class="inner-images">`;
    
    for (const image of data.images) {
      htmlImages += `<img src="${image}" class="inner-images">`
    }

    htmlImages += `</div>`;
  }
  div.innerHTML = `
    ${htmlFullName}
    ${htmlContent}
    ${htmlImages}
  `;
  //check cai typing truoc khi them tn vao list 
  body.insertBefore(div,boxTyping);

  bodyChat.scrollTop = bodyChat.scrollHeight;

  //Preview Image new
  const gallery = new Viewer(div);
});

// End SERVER_RETURN_MESSAGE

//Scroll Chat to bottom
  const bodyChat = document.querySelector(".chat .inner-body");
  if(bodyChat){
    bodyChat.scrollTop = bodyChat.scrollHeight;
  }
//End Scroll chat to bottom

// Show icon chat

  //Show popup
  const buttonIcon = document.querySelector('.button-icon');
  if(buttonIcon){
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonIcon, tooltip);

    buttonIcon.onclick = () => {
      tooltip.classList.toggle('shown');
    }
  }
  //End Show popup
  //Show Typing 
  var timeOut;
   const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show");
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    },5000);
   }
  //End Show Typing

  //Insert icon into input
  const emojiPicker = document.querySelector("emoji-picker");
  if(emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");

    emojiPicker.addEventListener("emoji-click", (event) => {
      const icon = event.detail.unicode;
      inputChat.value = inputChat.value + icon; // giu lại tin nhan neu co + chen icon

      const end = inputChat.value.length;
      inputChat.setSelectionRange(end, end);
      inputChat.focus();
      showTyping();
    });
    //Input keyup
    inputChat.addEventListener("keyup", () => {
      showTyping();
    });
    //End Input keyup
}

  //End Insert icon into input
// End Show icon chat

//SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if(elementListTyping){
  socket.on("SERVER_RETURN_TYPING", (data) => {
    console.log(data);
    if(data.type == "show"){
      const bodyChat = document.querySelector(".chat .inner-body");
      const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
      //check da co nguoi typing chua neu co thi ko render ra nhieu lan 
      if(!existTyping){
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);

        boxTyping.innerHTML = `
          <div class="inner-name">${data.fullName}</div>
          <div class="inner-dots">
            <span></span>
            <span></span> 
            <span></span>
          </div>
        `;
        elementListTyping.appendChild(boxTyping);
        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    } else {
      const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
      if(boxTypingRemove){
        elementListTyping.removeChild(boxTypingRemove);
      }
    }

   
  })
}
 
//End SERVER_RETURN_TYPING\

 //Review Full Image
 document.addEventListener("DOMContentLoaded", () => {
  const imageContainer = document.querySelector(".chat .inner-body");
  if (imageContainer) {
      new Viewer(imageContainer, {
          url: "src", // Xác định thuộc tính chứa ảnh
          toolbar: true, // Hiển thị thanh công cụ
          navbar: false, // Ẩn thanh điều hướng ảnh
          title: false, // Ẩn tiêu đề ảnh
          loop: false // Không lặp ảnh
      });
  }
});

 //End Review Full Image
