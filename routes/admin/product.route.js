const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/product.controller")
const multer = require("multer");
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage : storageMulter()}); // Đường dẫn để lưu file upload

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus); //truyen status dong va id dong
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.create); // return giao dien
router.post("/create", upload.single("thumbnail"), controller.createPost); // return create item

module.exports = router;