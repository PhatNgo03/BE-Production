const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const AccountAdmin = require("../../models/account.model");
const AccountUser = require("../../models/user.model");
// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    const statistic = {
        categoryProduct : {
            total: 0,
            active: 0, 
            inactive: 0
        },
        product : {
            total: 0,
            active: 0, 
            inactive: 0
        },
        account : {
            total: 0,
            active: 0, 
            inactive: 0
        },
        user : {
            total: 0,
            active: 0, 
            inactive: 0
        }
    }

    //productCategory
    statistic.categoryProduct.total = await ProductCategory.countDocuments({
        delete : false
    });
    statistic.categoryProduct.active = await ProductCategory.countDocuments({
        delete : false,
        status: "active"
    });
    statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
        delete : false,
        status : "inactive"
    });
    //product
    statistic.product.total = await Product.countDocuments({
        delete : false
    });
    statistic.product.active = await Product.countDocuments({
        delete : false,
        status: "active"
    });
    statistic.product.inactive = await Product.countDocuments({
        delete : false,
        status : "inactive"
    });
    //account admin
    statistic.account.total = await AccountAdmin.countDocuments({
        delete : false
    });
    statistic.account.active = await AccountAdmin.countDocuments({
        delete : false,
        status: "active"
    });
    statistic.account.inactive = await AccountAdmin.countDocuments({
        delete : false,
        status : "inactive"
    });
    //account user
    statistic.user.total = await AccountUser.countDocuments({
        delete : false
    });
    statistic.user.active = await AccountUser.countDocuments({
        delete : false,
        status: "active"
    });
    statistic.user.inactive = await AccountUser.countDocuments({
        delete : false,
        status : "inactive"
    });
    res.render("./admin/pages/dashboard/index.pug", {
        pageTitle: "Trang tổng quan",
        statistic: statistic
    })
}