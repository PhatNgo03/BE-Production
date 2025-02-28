const Role = require("../../models/role.model")
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    delete :false
  }
  const records = await Role.find(find);
  res.render("./admin/pages/roles/index.pug", {
      pageTitle: "Nhóm quyền",
      records:records
  })
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("./admin/pages/roles/create.pug", {
      pageTitle: "Tạo mới nhóm quyền",
  })
}


// [GET] /admin/roles/create
module.exports.createPost = async (req, res) => {
  // console.log(req.body);
  const record = new Role(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/roles`);
  // res.render("./admin/pages/roles/create.pug", {
  //     pageTitle: "Tạo mới nhóm quyền",
  // })
}


// [GET] /admin/roles/edit/:"id"
module.exports.edit =  async(req, res) => {
  // console.log(req.params.id);
  try{
  const find = {
    delete : false,
    _id: req.params.id
  }
  const roles = await Role.findOne(find);

  res.render("admin/pages/roles/edit", {
    pageTitle: "Chỉnh sửa nhóm quyền",
    roles: roles,
  });
  } catch(error){
    req.flash("error", "Đã xảy ra lỗi khi tìm kiếm danh mục sản phẩm!");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH] /admin/products/edit/:"id"
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  try {
    await Role.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật danh mục sản phẩm thành công!"); 
  } catch (error) {
    req.flash("error", "Cập nhật danh mục sản phẩm thất bại!");
  }

  res.redirect("back");
};

// [Get] /admin/roles/permission"
module.exports.permissions = async (req, res) => {
  let find = {
    delete :false 
  }
  const records = await Role.find(find);
  res.render("admin/pages/roles/permissions", {
    pageTitle: "Phân quyền",
    records: records,
  });
};
//quan ly don hang admin

// [PATCH] /admin/roles/permissionsPatch"
module.exports.permissionsPatch = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions);
  try{
    for(const item of permissions){
      await Role.updateOne({_id: item.id}, {permissions: item.permissions})
    }
    req.flash("success", "Cập nhật phân quyền thành công!"); 
    res.redirect("back");
  }
  catch(error){
    req.flash("error", "Cập nhật phân quyền thất bại!");
  }
};