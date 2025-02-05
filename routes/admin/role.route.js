const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/role.controller")
const validate = require("../../validates/admin/product-category.validate");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", controller.createPost);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  controller.editPatch,
  validate.createPost,
  );
router.get("/permissions",controller.permissions);
router.patch(
  "/permissions",
  controller.permissionsPatch,
  );
module.exports = router;