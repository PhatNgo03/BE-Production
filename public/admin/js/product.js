//Change status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {

  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");
  // console.log(path);

  buttonsChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      let statusChange = statusCurrent == "active" ? "inactive" : "active";

      const action = path + `/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.action = action;
      formChangeStatus.submit();
    });
  });
}
//End change status

//Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]") //query to table chua item
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsId.forEach(input => {
        input.checked = true;
      });
    } else {
      inputsId.forEach(input => {
        input.checked = false;
      });
    }
  }); 

  inputsId.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length; //count sl item checked
      // console.log(countChecked);
      // console.log(inputsId.length);
      if(countChecked === inputsId.length){
        inputCheckAll.checked = true;
      }
      else {
        inputCheckAll.checked = false;
      }
    });
  });
}
//End checkbox Multi

//Form Change Multi
const  formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
  // console.log(formChangeMulti);
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputChecked = checkboxMulti.querySelectorAll("input[name='id']:checked"); 

    if(inputChecked.length > 0){
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputChecked.forEach(input => {
        const id = input.getAttribute("value");
        // const id = input.value
        ids.push(id);
      });
      inputIds.value= ids.join(", ");
      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất một mặt hàng!");
    }
  })
}
//End form change multi


