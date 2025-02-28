const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  try {
    if (!req.cookies.cartId) {
      // Nếu không có cartId, tạo giỏ hàng mới
      const cart = new Cart();
      await cart.save();

      const expiresCookie = 365 * 24 * 60 * 60 * 1000;
      res.cookie("cartId", cart.id, {
        expires: new Date(Date.now() + expiresCookie),
      });

      res.locals.miniCart = cart;
    } else {
      // Lấy giỏ hàng từ DB
      let cart = await Cart.findOne({ _id: req.cookies.cartId });

      // Nếu cart bị null (do bị xóa), tạo giỏ hàng mới
      if (!cart) {
        cart = new Cart();
        await cart.save();
        res.cookie("cartId", cart.id, {
          expires: new Date(Date.now() + expiresCookie),
        });
      }

      // Đảm bảo `products` tồn tại trước khi sử dụng reduce()
      cart.totalQuantity = cart.products?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      res.locals.miniCart = cart;
    }
  } catch (error) {
    console.error("Lỗi middleware giỏ hàng:", error);
    res.locals.miniCart = { products: [], totalQuantity: 0 };
  }
  
  next();
};
