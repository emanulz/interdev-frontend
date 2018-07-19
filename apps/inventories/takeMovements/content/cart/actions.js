import alertify from 'alertifyjs'

export function removeFromCart(itemsInCart, code) {

  const indexInCart = itemsInCart.findIndex(item => item.uuid == code) // checks if product exists

  const res = (indexInCart == -1) // if not exists dispatch Not Found, if exists check if already in cart
    ? {
      type: 'PRODUCT_IN_CART_NOT_FOUND',
      payload: -1
    }
    : {
      type: 'REMOVE_FROM_TAKE_MOVEMENTS_CART',
      payload: indexInCart
    }

  return res
}

export function updateQty(itemsInCart, code, qty) {

  const qtyNum = parseFloat(qty)
  const indexInCart = itemsInCart.findIndex(item => item.uuid == code) // checks if product exists

  if (indexInCart != -1) {
    if (!itemsInCart[indexInCart].product.fractioned && !Number.isInteger(qtyNum)) {
      alertify.alert('NO FRACIONADO', `El producto seleccionado solo acepta valores enteros, no acepta fracionados`)
      return false
    }
  }

  const res = (indexInCart == -1) // if not exists dispatch Not Found, if exists check if already in cart
    ? {
      type: 'PRODUCT_IN_CART_NOT_FOUND',
      payload: -1
    }
    : {
      type: 'UPDATE_TAKE_MOVEMENTS_CART_QTY',
      payload: {index: indexInCart, qty: qty}
    }

  return res
}
