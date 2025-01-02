const express = require("express")
const router = express.Router();

router.get("/", (req, res) => {
    res.render("client/pages/products/product.pug")
});
module.exports = router;