const dashboardRoutes = require("./dashboard.route");
const systemConfig = require("../../config/system");
const productRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const roleRouters = require("./role.route");
const accountRouters = require("./account.route");
const authRouters = require("./auth.route");
module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
    app.use(PATH_ADMIN + "/products", productRoutes);
    app.use(PATH_ADMIN + "/product-category", productCategoryRoutes);
    app.use(PATH_ADMIN + "/roles", roleRouters);
    app.use(PATH_ADMIN + "/accounts", accountRouters);
    app.use(PATH_ADMIN + "/auth", authRouters);
}