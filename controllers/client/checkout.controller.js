const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const productHelper = require("../../helpers/product");

//  [GET] /checkout/
module.exports.index = async(req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id : cartId
  })

  if(cart.products.length > 0){
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id : productId,
      }).select("title thumbnail slug price discountPercentage");

      productInfo.priceNew = productHelper.priceNewItemProduct(productInfo);
      item.productInfo = productInfo;
      item.totalPrice = productInfo.priceNew * item.quantity;

    }
  }
  //tong tien don hang
  cart.totalPrice = cart.products.reduce((sum ,item) => sum + item.totalPrice, 0);
  res.render("client/pages/checkout/index.pug", {
    pageTitle: "Đặt hàng",
    cartDetail: cart
  });
}


//  [POST] /checkout/order
module.exports.order = async(req, res) => {
  const cartId = req.cookies.cartId;
  //get info order
  const userInfo = req.body;
  //get cart
  const cart = await Cart.findOne({
      _id : cartId
  });
  const products = [];
  for(const product of cart.products){
    const objectProduct = {
      product_id: product.product_id,
      quantity : product.quantity,
      price: 0 ,
      discountPercentage: 0
    };

    const productInfo = await Product.findOne({
      _id:  product.product_id
    }).select("price discountPercentage");

    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;

    products.push(objectProduct);
  }

  const orderInfo = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products
  }

  const order = new Order(orderInfo);
  order.save();
 
  await Cart.updateOne({
    _id: cartId
  }, {
    products: []
  });

  res.redirect(`/checkout/success/${order.id}`);
  //Neu dung tich chon sp trong cart thi giong ben admin product và dung pull thay vi products : []
}

//  [POST] /checkout/success/:orderId
module.exports.success = async(req, res) => {
  const order = await Order.findOne({
    _id : req.params.orderId
  })
  for(const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id
    }).select("title thumbnail");
    product.productInfo = productInfo;

    product.priceNew = productHelper.priceNewItemProduct(product);
    //total 1 product
    product.totalPrice = product.priceNew * product.quantity;
  }
  //total order all product
  order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);
  console.log(order);
  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt hàng thành công!",
    order: order
  });
}
