const Cart = require("../../models/cart.model");

//  [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId; 

  console.log("cartId:", cartId);

  if (!cartId) {
    return res.status(400).json({ error: "Cart ID không hợp lệ hoặc không tồn tại" });
  }

  const cart = await Cart.findOne({ _id: cartId });

  if (!cart) {
    return res.status(404).json({ error: "Giỏ hàng không tồn tại" });
  }

  const existProductInCart = cart.products.find(item => item.product_id === productId);

  if (existProductInCart) {
    const quantityNew = quantity + existProductInCart.quantity;
    console.log(quantityNew);
    await Cart.updateOne(
      { _id: cartId, "products.product_id": productId },
      { $set: { "products.$.quantity": quantityNew } }
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity
    };

    await Cart.updateOne(
      { _id: cartId },
      { $push: { products: objectCart } }
    );
  }

  req.flash("success", "Đã thêm sản phẩm vào giỏ hàng thành công");
  res.redirect("back");
};
