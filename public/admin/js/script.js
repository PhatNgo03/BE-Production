const buttonStatus = document.querySelectorAll("[button-status]");
if(buttonStatus.length > 0){
    let url = new URL(window.location.href);
    // console.log(url);

    buttonStatus.forEach(button => {
      button.addEventListener("click", () => {
        const status = button.getAttribute("button-status");

        if(status) {
          url.searchParams.set("status", status);
        } else {
          url.searchParams.delete("status");
        }
        // console.log(url.href);
        window.location.href = url.href
      })
    })
}
//End button status product

//Form Search
const formSearch = document.querySelector("#form-search");
if(formSearch){
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    // console.log(e.target.elements.keyword.value);
    const keyword =  e.target.elements.keyword.value
    if(keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href
  });
}
//End Form Search

//Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if(buttonPagination){
  buttonPagination.forEach(button => {
    let url = new URL(window.location.href);
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
1
      url.searchParams.set("page", page);
      window.location.href =  url.href; // chuyen huong den trang page hien tai
    });
  });
}
//End pagination

//Show alert

const showAlert = document.querySelector("[show-alert]");
if(showAlert){
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]")
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  },  time);
  closeAlert.addEventListener("click", () =>{
    showAlert.classList.add("alert-hidden");
  })
}
//End show alert

//Upload images
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  const removeButton = document.querySelector("[upload-image-remove]");
  const imagePreviewContainer = document.querySelector("[image-preview-container]");
  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
      uploadImagePreview.style.display = 'block'; // Show the preview
      removeButton.style.display = 'block'; // Show the "X" button
      imagePreviewContainer.style.display = 'block';

    }
  });
  removeButton.addEventListener("click", () => {
    uploadImagePreview.src = "";
    uploadImagePreview.style.display = 'none'; // Hide the preview
    removeButton.style.display = 'none'; // Hide the "X" button
    imagePreviewContainer.style.display = 'none';
    uploadImageInput.value = ""; // Clear the input field

  });
}

// End Upload images