const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/product.controller");
const multer = require("multer");

const upload = multer();
// const storageMulter = require("../../helpers/storageMulter");
// const upload = multer({ storage : storageMulter()}); // Đường dẫn để lưu file upload
const validate = require("../../validates/admin/product.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus); //truyen status dong va id dong
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.create); // return giao dien
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
); // return create item
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.editPatch,
  validate.createPost,
  );
router.get("/detail/:id", controller.detail);
module.exports = router;