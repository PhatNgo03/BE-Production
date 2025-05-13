document.addEventListener("DOMContentLoaded", function () {
  const formDeleteItem = document.getElementById("form-delete-item");
  if (!formDeleteItem) return;

  const path = formDeleteItem.getAttribute("data-path");

  document.body.addEventListener("click", function (e) {
    const button = e.target.closest("[button-delete]");
    if (button) {
      const isConfirm = confirm("Bạn có chắc muốn xóa?");
      if (isConfirm) {
        const id = button.getAttribute("data-id");
        formDeleteItem.action = `${path}/${id}?_method=DELETE`;
        formDeleteItem.submit();
      }
    }
  });
});
