// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

export function addToReturn(item, qty, alreadyReturned) {
  const subtotal = (item.subtotal / item.qty) * qty
  const totalIv = ((item.totalWithIv - item.subtotal) / item.qty) * qty
  const totalWithIv = (item.totalWithIv / item.qty) * qty
  const line = {
    id: item.product.id,
    uuid: item.uuid,
    originalItem: item,
    qty: qty,
    subtotal: subtotal,
    totalIv: totalIv,
    totalWithIv: totalWithIv
  }
  if (alreadyReturned >= item.qty) {
    alertify.alert('ERROR', `Usted está intentando agregar un elemento que ya fue devuelto modificando los atributos,
                             por favor no intente modificar la página, un EMAIL ha sido enviado a los desarrolladores con el usuario que intenta realizar la acción`)
    return false
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

// UPDATE QTY IN RETURN, check if the qty is not more than the total in cart
export function updateQty (code, qty, itemsInCart, sale) {
  const qtyNum = parseFloat(qty)
  const indexInCart = itemsInCart.findIndex(item => item.originalItem.uuid == code)

  const product = itemsInCart[indexInCart].originalItem.product

  if (!product.fractioned && !Number.isInteger(qtyNum)) {
    alertify.alert('NO FRACIONADO', `El producto seleccionado solo acepta valores enteros, no acepta fracionados`)
    return {type: 'NOT', payload: -1}
  }

  const alreadyReturned = getAlreadyReturnedQty(itemsInCart[indexInCart].originalItem, sale)
  // console.log('ALREADY RETURNED --->', alreadyReturned)
  // IF THERE ARE ITEMS ALREADY IN CART
  if ((qtyNum + alreadyReturned) > parseFloat(itemsInCart[indexInCart].originalItem.qty)) {
    alertify.alert('ERROR', 'No puede agregar mas elementos del total de la línea en la venta oroginal.')
    return false
  }
  // CALC THE NEW TOTAL SUB AND TOTAL IV
  const subtotal = (itemsInCart[indexInCart].originalItem.subtotal / itemsInCart[indexInCart].originalItem.qty) * qtyNum
  const totalIv = ((itemsInCart[indexInCart].originalItem.totalWithIv - itemsInCart[indexInCart].originalItem.subtotal) / itemsInCart[indexInCart].originalItem.qty) * qtyNum
  const totalWithIv = (itemsInCart[indexInCart].originalItem.totalWithIv / itemsInCart[indexInCart].originalItem.qty) * qtyNum

  const res = {
    type: 'UPDATE_RETURN',
    payload: {
      item: {...itemsInCart[indexInCart], qty: qtyNum, subtotal: subtotal, totalIv: totalIv, totalWithIv: totalWithIv},
      index: indexInCart
    }
  }
  return res
  // const inventory = JSON.parse(product.inventory_existent)
  // if (!product.inventory_enabled || inventory[warehouseId] >= qtyToCheck || product.inventory_negative) {
  //   return res
  // }
  // // OTHERWISE RAISE ERROR AND DO NOT ADD TO CART
  // alertify.alert('BAJO INVENTARIO', `No hay suficiente existencia en bodega para el producto seleccionado, hay
  //                ${inventory[warehouseId]} unidades en la bodega de ventas.`)
  // return {type: 'NO_ACTION', payload: ''}
}

export function getAlreadyReturnedQty(item, sale) {

  try {
    const itemReturns = sale.returns_collection.filter(row => {
      if (row.uuid) {
        return row.uuid == item.uuid
      }
      return row.id == item.product.id
    })
    let alreadyReturned = 0
    for (let i = 0; i < itemReturns.length; i++) {
      alreadyReturned += parseFloat(itemReturns[i]['ret_qty'])
    }
    return alreadyReturned

  } catch (err) {
    return 0
  }

}
