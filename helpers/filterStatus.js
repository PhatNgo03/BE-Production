module.exports = (query) => {
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: ""
    },
    {
      name: "Hoạt động",
      status: "active",
      class: ""
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: ""
    }
  ]

  //filterStatus
  if(query.status){
    const index = filterStatus.findIndex(item => item.status == query.status); //Tim index status == status click
    filterStatus[index].class = "active";
  }else{
    const index = filterStatus.findIndex(item => item.status == ""); //Tim index status == status click
    filterStatus[index].class = "active";
  }

  return filterStatus;
}