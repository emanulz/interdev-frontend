// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
const uuidv1 = require('uuid/v1')
// ------------------------------------------------------------------------------------------
// EXPORT FUNCTIONS USED IN COMPONENTS
// ------------------------------------------------------------------------------------------

// Function to update the globa; discount of complete storage of items, and reflect it on store, then updating DOME
export function recalcCart(itemsInCart, globalDiscount, client) {

  const newCart = itemsInCart.map(item => {

    const newItem = item

    const data = caclSubtotal(item.product, item.qty, item.discount, globalDiscount, client)

    newItem.subtotal = data.subtotal
    newItem.totalWithIv = data.totalWithIv
    newItem.discountCurrency = data.discountCurrency
    newItem.subTotalNoDiscount = data.subTotalNoDiscount
    newItem.priceToUse = data.priceToUse

    return newItem

  })

  return {type: 'REPLACE_CART', payload: newCart}

}

// When item is selected in code field
export function productSelected(code, qty, products, itemsInCart, defaultConfig, userConfig) {

  const perLine = false

  const productSelected = products.findIndex(product => {
    return product.code == code || product.barcode == code
  }) // checks if product exists

  const res = (productSelected == -1) // if not exists dispatch Not Found, if exists check if already in cart
    ? {
      type: 'PRODUCT_NOT_FOUND',
      payload: -1
    }
    : checkIfInCart(code, qty, products, itemsInCart, productSelected, perLine)

  return res

}

// Updates Amount based on qty input field

export function updateItem(search_key, is_search_uuid, itemsInCart, qty, subtotal){

  const index = is_search_uuid 
  ?itemsInCart.findIndex(item=> item.uuid==search_key)
  :itemsInCart.findIndex(item=> item.product.code == search_key || item.product.barcode == search_key)

  const qtyNum = qty==-1?itemsInCart[index].qty:qty //if -1 was received, keep the current qty
  const subtotalNum = subtotal==-1?itemsInCart[index].subtotal:subtotal//if -1 was received, keep the current subtotal

  const res = {
    type: 'UPDATE_CART',
    payload: {
      item: updatedCartItem(itemsInCart, index, qtyNum, subtotalNum),
      index:index
    }
  }
  return res
}


// Updates Amount based on qty input field

export function addSubOne (code, subOrAdd, itemsInCart) {

  const indexInCart = itemsInCart.findIndex(item => item.product.code == code)
  const qtyNum = subOrAdd ? parseFloat(itemsInCart[indexInCart].qty + 1) : parseFloat(itemsInCart[indexInCart].qty - 1)
  const res = {
    type: 'UPDATE_CART',
    payload: {
      item: updatedCartItem(itemsInCart, indexInCart, qtyNum, itemsInCart[indexInCart].uuid),
      index: indexInCart
    }
  }
  return res
}

// ------------------------------------------------------------------------------------------
// LOCAL AUX FUNCTIONS
// ------------------------------------------------------------------------------------------

// checks in cart if item already exists
function checkIfInCart(code, qty, products, itemsInCart,  productSelected, perLine) {

  // check if product in cart
  const indexInCart = itemsInCart.findIndex(cart => cart.product.code == code || cart.product.barcode == code)

  // CHECK IF CONFIG ALLOWS MULTIPLE LINES OR NOT
  if (perLine) {
    const uuid = uuidv1()
    const res = (indexInCart == -1) // if not exists in cart Dispats ADD_TO_TABLE, if exists dispatch cart updated
      ? {
        type: 'ADD_TO_CART',
        payload: {
          uuid: uuid,
          product: products[productSelected],
          qty: qty,
          subtotal: 0,
          saved: 'new',
        }
      }

      : {
        type: 'UPDATE_CART',
        payload: {
          item: updatedCartItem(itemsInCart, indexInCart, itemsInCart[indexInCart].qty + qty, itemsInCart[indexInCart].uuid),
          index: indexInCart
        }
      }
    return res

  // IGNORE IF ALREADY IN CART IF CONFIG SAYS THAT
  } else {
    const uuid = uuidv1()
    const res = {
      type: 'ADD_TO_CART',
      payload: {
        uuid: uuid,
        product: products[productSelected],
        qty: qty,
        subtotal: 0,
        status:'new',
      }
    }
    return res
  }

}

// updates an item in the cart with new information, this aux funtion returns new updated object ready for replace the stored one
function updatedCartItem(itemsInCart, index, newQty, newSubTotal) {
  //keep the subtotal de the same
  const uuid = itemsInCart[index].uuid
  return {
    uuid: uuid,
    product: itemsInCart[index].product,
    qty: newQty,
    subtotal: newSubTotal,
    status:'modified'
  }
}

export function setProduct(kwargs, resolve, reject){
  const lookUpValue = kwargs.lookUpValue
  const lookUpField = kwargs.lookUpField
  const url = kwargs.url

  axios.get(`${url}?${lookUpField}=${lookUpValue}`).then(function(response) {
    if (response.data.count) {
      // IF THERE IS MORE THAN ONE ELEMENT FILTERED
      if (response.data.count > 1) {
        alertify.alert('ATENCIÓN', `Existe mas de un ${kwargs.modelName} con el ${kwargs.lookUpName}:
        ${kwargs.lookUpValue}, se utilizará el primero en lista, por lo que puede no ser el mismo que ud desea
        actualizar, esto puede deberse a un error, por favor revise los
        datos o contacte con el administrador del sistema.`)
      }

      resolve(response.data)

    } else {
      alertify.alert('Error', `No hay ${kwargs.modelName} con el valor de ${kwargs.lookUpName}: ${kwargs.lookUpValue}`)
      reject()
    }

  }).catch(function(error) {
    alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
    administrador del sistema con el siguiete error: ${error}`)
    reject()
  })
}