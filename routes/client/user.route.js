const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller.js")
const validates = require("../../validates/client/user.validate");
const authMiddleware = require("../../middlewares/client/auth.middleware");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/client/uploadCloud.middleware");
router.get("/register", controller.register);
router.post("/register", validates.registerPost, controller.registerPost);
router.get("/login", controller.login);
router.post("/login", validates.loginPost, controller.loginPost);
router.get("/logout", controller.logout);
router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot",validates.forgotPasswordPost, controller.forgotPasswordPost);
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);
router.get("/password/otp", controller.otpPassword);
router.get("/password/reset", controller.resetPassword);
router.post("/password/reset",validates.resetPasswordPost, controller.resetPasswordPost);
router.get("/info",authMiddleware.requireAuth, controller.info);
router.get("/edit", authMiddleware.requireAuth, controller.editUser);
router.post("/edit", authMiddleware.requireAuth, upload.single("avatar"), uploadCloud.upload, controller.updateUser);

module.exports = router; 