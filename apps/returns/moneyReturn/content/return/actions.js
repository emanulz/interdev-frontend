
export function addToReturn(item, qty) {
  const subtotal = (item.subtotal / item.qty) * qty
  const totalIv = ((item.totalWithIv - item.subtotal) / item.qty) * qty
  const totalWithIv = (item.totalWithIv / item.qty) * qty
  const line = {
    id: item.product.id,
    uuid: item.uuid,
    originalItem: item,
    qty: item.qty,
    subtotal: subtotal,
    totalIv: totalIv,
    totalWithIv: totalWithIv
  }
  return function(dispatch) {
    dispatch({'type': 'ADD_TO_RETURN', 'payload': line})
  }
}

export function removeFromReturn(itemsInCart, code) {

  const indexInCart = itemsInCart.findIndex(item => item.uuid == code) // checks if product exists

  const res = (indexInCart == -1) // if not exists dispatch Not Found, if exists check if already in cart
    ? {
      type: 'PRODUCT_IN_RETURN_NOT_FOUND',
      payload: -1
    }
    : {
      type: 'REMOVE_FROM_RETURN',
      payload: indexInCart
    }

  return res
}

// This function updates totals the cart store item, generates new values according cart item objects, then push the to store
export function updateTotals(inCart) {

  let subtotal = 0
  let taxes = 0
  let total = 0

  // for Each element adds the values to get totals
  inCart.forEach((item) => {

    subtotal = subtotal + item.subtotal
    taxes = taxes + item.totalIv
    total = total + item.totalWithIv
  })
  // TODO Config for round or not
  // total = Math.round(subtotal + taxes)
  total = subtotal + taxes
  // returs a dispatch with a payload of the obtained values
  const totalRounded = Math.round((total / 5)) * 5

  return {
    type: 'UPDATE_RETURN_TOTALS',
    payload: {
      subtotal: subtotal,
      taxes: taxes,
      total: totalRounded,
      totalNotRounded: total
    }
  }
}
