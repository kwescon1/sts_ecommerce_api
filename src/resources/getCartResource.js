class CartResource {
  constructor(cart) {
    this.cart = cart;
  }

  toJson() {
    const formattedItems = this.cart.items.map((item) => {
      return {
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        product: {
          id: item.product.id,
          name: item.product.name,
          sku: item.product.sku,
          // category_id: item.product.category_id,
          cost_price: item.product.stock.cost_price,
        },
      };
    });

    const overallTotalPrice = formattedItems.reduce((total, item) => {
      return total + item.price;
    }, 0);

    const totalProducts = formattedItems.length;

    return {
      id: this.cart.id,
      user_id: this.cart.user_id,
      //   is_current: this.cart.is_current,
      items: formattedItems,
      sub_total: overallTotalPrice,
      total_products: totalProducts,
    };
  }
}

module.exports = CartResource;
