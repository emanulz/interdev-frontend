// ------------------------------------------------------------------------------------------
// EXPORT FUNCTIONS USED IN COMPONENTS
// ------------------------------------------------------------------------------------------

// This function updates totals the cart store item, generates new values according cart item objects, then push the to store
export function updateTotals(inCart, total_taxes, orderTransport) {

  let subtotal = 0
  let total = 0
  let total_discount = 0

  // for Each element adds the values to get totals
  inCart.forEach((item) => {
    subtotal += item.subtotal
    total_discount += item.discount
  })
  // TODO Config for round or not
  // total = Math.round(subtotal + taxes)
  total = subtotal + total_taxes - total_discount + orderTransport
  // returs a dispatch with a payload of the obtained values
  return {
    type: 'UPDATE_CART_TOTALS',
    payload: {
      subtotal: subtotal,
      taxes: total_taxes,
      total: total,
      discountTotal: total_discount,
    }
  }
}

// Finds a code in the cart and sends a dispatch to remove it from cart based on index
export function removeFromCart(itemsInCart, code) {

  const indexInCart = itemsInCart.findIndex(item => item.uuid == code) // checks if product exists

  const res = (indexInCart == -1) // if not exists dispatch Not Found, if exists check if already in cart
    ? {
      type: 'PRODUCT_IN_CART_NOT_FOUND',
      payload: -1
    }
    : {
      type: 'REMOVE_FROM_CART',
      payload: indexInCart
    }

  return res
}
