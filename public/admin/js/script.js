//Button status product
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
      console.log(page);

      url.searchParams.set("page", page);
      window.location.href =  url.href; // chuyen huong den trang page hien tai
    });
  });
}
//End pagination

