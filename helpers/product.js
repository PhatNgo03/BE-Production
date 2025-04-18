module.exports.priceNewProduct = (products) => {
  const newProducts = products.map(item => {
    item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
    return item;
});
  return newProducts;
}

module.exports.priceNewItemProduct = (product) => {
  const priceNew = (
    (product.price * (100 - product.discountPercentage)) / 100).toFixed(0);
    return parseInt(priceNew);
}