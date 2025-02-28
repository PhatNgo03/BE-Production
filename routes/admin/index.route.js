const dashboardRoutes = require("./dashboard.route");
const authMiddleWare =  require("../../middlewares/admin/auth.middleware")
const systemConfig = require("../../config/system");
const productRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const roleRouters = require("./role.route");
const accountRouters = require("./account.route");
const authRouters = require("./auth.route");
const myAccountRouters = require("./my-account.route");
const settingRouters = require("./setting.route");
module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard",
        authMiddleWare.requireAuth,
        dashboardRoutes
    );
    app.use(PATH_ADMIN + "/products",  authMiddleWare.requireAuth, productRoutes);
    app.use(PATH_ADMIN + "/product-category",  authMiddleWare.requireAuth, productCategoryRoutes);
    app.use(PATH_ADMIN + "/roles",  authMiddleWare.requireAuth, roleRouters);
    app.use(PATH_ADMIN + "/accounts",  authMiddleWare.requireAuth, accountRouters);
    app.use(PATH_ADMIN + "/auth", authRouters);
    app.use(PATH_ADMIN + "/my-account",  authMiddleWare.requireAuth, myAccountRouters);
    app.use(PATH_ADMIN + "/settings",  authMiddleWare.requireAuth, settingRouters);
}