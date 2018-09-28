// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'
import axios from 'axios'

// ------------------------------------------------------------------------------------------
// CONFIG DEFAULT AXIOS
// ------------------------------------------------------------------------------------------

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const uuidv1 = require('uuid/v1')

// ------------------------------------------------------------------------------------------
// EXPORT FUNCTIONS USED IN COMPONENTS
// ------------------------------------------------------------------------------------------

// Function to update the globa; discount of complete storage of items, and reflect it on store, then updating DOME
export function recalcCart(itemsInCart, pricesDetails, priceListSelected, usePriceListAsDefault, clientUpdated) {

  const newCart = itemsInCart.map(item => {

    const detail = pricesDetails.find(line => {
      return line.id == item.product.id
    })
    console.log('DETAIL', detail)

    const newItem = item
    // DETERMIN THE PRICE TO USE
    const price = determinPriceToUse(detail, priceListSelected, usePriceListAsDefault)
    item.product.price = price

    // IF THE CLIENT WAS UPDATED USE THE DEFAULT DISCOUNT, ELSE USE THE DISCOUNT ALREADY APPLIED TO ITEM
    let data
    if (clientUpdated) {
      // if the client was updated use the default discount in items list details
      const predDiscount = parseFloat(detail.default_discount)
      item.discount = predDiscount
      data = caclSubtotal(item.product, item.qty, predDiscount)
    } else {
      data = caclSubtotal(item.product, item.qty, item.discount)
    }

    newItem.subtotal = data.subtotal
    newItem.totalWithIv = data.totalWithIv
    newItem.discountCurrency = data.discountCurrency
    newItem.subTotalNoDiscount = data.subTotalNoDiscount
    newItem.priceToUse = data.priceToUse

    return newItem

  })

  return {type: 'REPLACE_CART', payload: newCart}

}

// Function to update the inline discount of an item, and reflect it on store
export function updateItemDiscount(itemsInCart, code, discount, predDiscount, client, pricesDetails) {

  const indexInCart = itemsInCart.findIndex(item => item.uuid == code) // checks if product exists
  const product = itemsInCart[indexInCart].product
  const maxDiscount = determinMaxDiscount(product, pricesDetails)
  console.log('DISCOUNT', discount)
  if (maxDiscount >= discount) {
    const res = (indexInCart == -1) // if not exists dispatch Not Found, if exists check if already in cart
      ? {
        type: 'PRODUCT_IN_CART_NOT_FOUND',
        payload: -1
      }
      : {
        type: 'UPDATE_CART',
        payload: {
          item: updatedCartItem(itemsInCart, indexInCart, itemsInCart[indexInCart].qty, discount, predDiscount, client,
            itemsInCart[indexInCart].uuid),
          index: indexInCart
        }
      }

    return res
  }

  alertify.alert('DESCUENTO NO PERMITIDO', `El descuento máximo permitido para el artículo es ${maxDiscount}%, se aplicará ese descuento.`)
  // IF DISCOUNT IS HIGHER APPLY MAXDISCOUNT INSTEAD
  const res2 = (indexInCart == -1) // if not exists dispatch Not Found, if exists check if already in cart
    ? {
      type: 'PRODUCT_IN_CART_NOT_FOUND',
      payload: -1
    }
    : {
      type: 'UPDATE_CART',
      payload: {
        item: updatedCartItem(itemsInCart, indexInCart, itemsInCart[indexInCart].qty, maxDiscount, predDiscount, client,
          itemsInCart[indexInCart].uuid),
        index: indexInCart
      }
    }
  return res2

}

function determinMaxDiscount(product, pricesDetails) {
  const detail = pricesDetails.find(line => {
    return line.id == product.id
  })
  if (detail) {
    return parseFloat(detail.max_discount)
  }
  return 0
}

// Function to update the inline discount of an item, and reflect it on store
export function updateItemLote(itemsInCart, code, lote) {
  const loteNum = !lote ? '-' : lote
  const indexInCart = itemsInCart.findIndex(item => item.uuid == code) // checks if product exists

  const res = (indexInCart == -1) // if not exists dispatch Not Found, if exists check if already in cart
    ? {
      type: 'PRODUCT_IN_CART_NOT_FOUND',
      payload: -1
    }
    : {
      type: 'UPDATE_CART_ITEM_LOTE',
      payload: {
        lote: loteNum,
        index: indexInCart
      }
    }

  return res

}

// When item is selected in code field
export function productSelected(lineData, qty, itemsInCart, client, warehouseId, perLineVal, priceListSelected, usePriceListAsDefault) {

  // GET TE DATA FROM THE LINE DATA
  const code = lineData.product.code
  const product = lineData.product
  const predDiscount = lineData.default_discount
  // DETERMIN THE PRICE TO USE
  const price = determinPriceToUse(lineData, priceListSelected, usePriceListAsDefault)
  product.price = price

  // FIRST CHECK: IF FRACTIONED IS FALSE AND IF NUM IS NOT INTEGER
  if (!product.fractioned && !Number.isInteger(qty)) {
    alertify.alert('NO FRACIONADO', `El producto seleccionado solo acepta valores enteros, no acepta fracionados`)
    return {type: 'NOT', payload: -1}
  }
  let perLine = true
  if (perLineVal == false) {
    perLine = false
  }

  // FILTER CART LOOKING FOR SAME ITEMS
  const sameInCart = itemsInCart.filter(cart => cart.product.code == code || cart.product.barcode == code)
  // THIS VARIABLE HOLDS THE VALUE TO CHECK AGAINST
  let qtyToCheck = qty
  // IF THERE ARE ITEMS ALREADY IN CART
  if (sameInCart.length > 0) {
    // LOOP ADDING QTY OF ITEMS ALREADY IN CART
    for (let i = 0; i < sameInCart.length; i++) {
      qtyToCheck = qtyToCheck + sameInCart[i].qty
    }
  }
  const inventory = JSON.parse(product.inventory_existent)
  // CHECK THE INVENTORY OF PRODUCT, IF INVENTORY NOT ENABLE OR INVENTORY IS ENOUGHT OR CAN BE NEGATIVE
  if (!product.inventory_enabled || inventory[warehouseId] >= qtyToCheck || product.inventory_negative) {
    const res = checkIfInCart(code, qty, product, itemsInCart, predDiscount, client, perLine)
    return res
  }
  // OTHERWISE RAISE ERROR AND DO NOT ADD TO CART
  alertify.alert('BAJO INVENTARIO', `No hay suficiente existencia en bodega para el producto seleccionado, hay
                 ${inventory[warehouseId]} unidades en la bodega de ventas.`)
  return {type: 'NO_ACTION', payload: ''}
}

// Updates Amount based on qty input field

export function updateQty (code, qty, itemsInCart, predDiscount, client, warehouseId) {
  const qtyNum = parseFloat(qty)
  const indexInCart = itemsInCart.findIndex(item => item.uuid == code)

  const product = itemsInCart[indexInCart].product

  if (!product.fractioned && !Number.isInteger(qtyNum)) {
    alertify.alert('NO FRACIONADO', `El producto seleccionado solo acepta valores enteros, no acepta fracionados`)
    return {type: 'NOT', payload: -1}
  }

  const sameInCart = itemsInCart.filter(cart => cart.product.code == code || cart.product.barcode == code)
  // THIS VARIABLE HOLDS THE VALUE TO CHECK AGAINST
  let qtyToCheck = qtyNum
  // IF THERE ARE ITEMS ALREADY IN CART
  if (sameInCart.length > 0) {
    // LOOP ADDING QTY OF ITEMS ALREADY IN CART
    for (let i = 0; i < sameInCart.length; i++) {
      qtyToCheck = qtyToCheck + sameInCart[i].qty
    }
  }

  const res = {
    type: 'UPDATE_CART',
    payload: {
      item: updatedCartItem(itemsInCart, indexInCart, qtyNum, itemsInCart[indexInCart].discount, predDiscount, client,
        itemsInCart[indexInCart].uuid),
      index: indexInCart
    }
  }
  const inventory = JSON.parse(product.inventory_existent)
  if (!product.inventory_enabled || inventory[warehouseId] >= qtyToCheck || product.inventory_negative) {
    return res
  }
  // OTHERWISE RAISE ERROR AND DO NOT ADD TO CART
  alertify.alert('BAJO INVENTARIO', `No hay suficiente existencia en bodega para el producto seleccionado, hay
                 ${inventory[warehouseId]} unidades en la bodega de ventas.`)
  return {type: 'NO_ACTION', payload: ''}
}

export function updateQtyCode (code, qty, itemsInCart, predDiscount, client, warehouseId) {

  const indexInCart = itemsInCart.findIndex(item => item.product.code == code || item.product.barcode == code)
  const qtyNum = parseFloat(qty)

  const product = itemsInCart[indexInCart].product

  if (!product.fractioned && !Number.isInteger(qtyNum)) {
    alertify.alert('NO FRACIONADO', `El producto seleccionado solo acepta valores enteros, no acepta fracionados`)
    return {type: 'NOT', payload: -1}
  }

  // const sameInCart = itemsInCart.filter(cart => cart.product.code == code || cart.product.barcode == code)
  // THIS VARIABLE HOLDS THE VALUE TO CHECK AGAINST
  const qtyToCheck = qtyNum
  // IF THERE ARE ITEMS ALREADY IN CART
  // if (sameInCart.length > 0) {
  //   // LOOP ADDING QTY OF ITEMS ALREADY IN CART
  //   for (let i = 0; i < sameInCart.length; i++) {
  //     qtyToCheck = qtyToCheck + sameInCart[i].qty
  //   }
  // }

  const res = {
    type: 'UPDATE_CART',
    payload: {
      item: updatedCartItem(itemsInCart, indexInCart, qtyNum, itemsInCart[indexInCart].discount, predDiscount, client,
        itemsInCart[indexInCart].uuid),
      index: indexInCart
    }
  }
  const inventory = JSON.parse(product.inventory_existent)
  if (!product.inventory_enabled || inventory[warehouseId] >= qtyToCheck || product.inventory_negative) {
    return res
  }
  // OTHERWISE RAISE ERROR AND DO NOT ADD TO CART
  alertify.alert('BAJO INVENTARIO', `No hay suficiente existencia en bodega para el producto seleccionado, hay
                 ${inventory[warehouseId]} unidades en la bodega de ventas.`)
  return {type: 'NO_ACTION', payload: ''}
}

// Updates Amount based on qty input field

export function addSubOne (code, subOrAdd, itemsInCart, predDiscount, client, warehouseId) {

  const indexInCart = itemsInCart.findIndex(item => item.product.code == code)
  const qtyNum = subOrAdd ? parseFloat(itemsInCart[indexInCart].qty + 1) : parseFloat(itemsInCart[indexInCart].qty - 1)

  const product = itemsInCart[indexInCart].product

  // const sameInCart = itemsInCart.filter(cart => cart.product.code == code || cart.product.barcode == code)
  // THIS VARIABLE HOLDS THE VALUE TO CHECK AGAINST
  const qtyToCheck = qtyNum
  // IF THERE ARE ITEMS ALREADY IN CART

  const res = {
    type: 'UPDATE_CART',
    payload: {
      item: updatedCartItem(itemsInCart, indexInCart, qtyNum, itemsInCart[indexInCart].discount, predDiscount, client,
        itemsInCart[indexInCart].uuid),
      index: indexInCart
    }
  }
  const inventory = JSON.parse(product.inventory_existent)
  console.log(inventory)
  console.log(qtyToCheck)
  if (!product.inventory_enabled || inventory[warehouseId] >= qtyToCheck || product.inventory_negative) {
    return res
  }
  // OTHERWISE RAISE ERROR AND DO NOT ADD TO CART
  alertify.alert('BAJO INVENTARIO', `No hay suficiente existencia en bodega para el producto seleccionado, hay
                 ${inventory[warehouseId]} unidades en la bodega de ventas.`)
  return {type: 'NO_ACTION', payload: ''}
}

// ------------------------------------------------------------------------------------------
// LOCAL AUX FUNCTIONS
// ------------------------------------------------------------------------------------------

// checks in cart if item already exists
function checkIfInCart(code, qty, product, itemsInCart, predDiscount, client, perLine) {

  // check if product in cart
  const indexInCart = itemsInCart.findIndex(cart => cart.product.code == code || cart.product.barcode == code)

  const dataNewProd = caclSubtotal(product, qty, predDiscount)

  // CHECK IF CONFIG ALLOWS MULTIPLE LINES OR NOT
  if (perLine) {
    const uuid = uuidv1()
    const res = (indexInCart == -1) // if not exists in cart Dispats ADD_TO_TABLE, if exists dispatch cart updated
      ? {
        type: 'ADD_TO_CART',
        payload: {
          uuid: uuid,
          product: product,
          qty: qty,
          discount: dataNewProd.discount,
          discountCurrency: dataNewProd.discountCurrency,
          subTotalNoDiscount: dataNewProd.subTotalNoDiscount,
          subtotal: dataNewProd.subtotal,
          totalWithIv: dataNewProd.totalWithIv,
          lote: '-',
          priceToUse: dataNewProd.priceToUse
        }
      }

      : {
        type: 'UPDATE_CART',
        payload: {
          item: updatedCartItem(itemsInCart, indexInCart, itemsInCart[indexInCart].qty + qty,
            itemsInCart[indexInCart].discount, predDiscount, client, itemsInCart[indexInCart].uuid),
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
        product: product,
        qty: qty,
        discount: 0,
        discountCurrency: dataNewProd.discountCurrency,
        subTotalNoDiscount: dataNewProd.subTotalNoDiscount,
        subtotal: dataNewProd.subtotal,
        totalWithIv: dataNewProd.totalWithIv,
        lote: '-',
        priceToUse: dataNewProd.priceToUse
      }
    }
    return res
  }

}

// calculates the subtotal by line, also the total with iv included, the discount in currency format
function caclSubtotal(product, qty, productDiscount) {

  // const price = priceToUse(product, client)
  const price = product.price
  const subTotalNoDiscount = price * qty
  const discount = productDiscount ? parseFloat(productDiscount) : 0
  // const subTotal = price * qty * (1 - (productDiscount / 100)) * (1 - (predDiscount / 100))
  const subTotal = price * qty * (1 - (discount / 100))
  const iv1 = (product.use_taxes)
    ? subTotal * (product.taxes / 100)
    : 0

  const iv2 = (product.use_taxes2)
    ? subTotal * (product.taxes2 / 100)
    : 0

  const iv3 = (product.use_taxes3)
    ? subTotal * (product.taxes3 / 100)
    : 0

  const totalWithIv = subTotal + iv1 + iv2 + iv3

  const discountCurrencyInLine = price * qty * (discount / 100)
  // const discountCurrencyGlobal = ((price * qty) - discountCurrencyInLine) * (predDiscount / 100)

  // const discountCurrency = discountCurrencyInLine + discountCurrencyGlobal
  const discountCurrency = discountCurrencyInLine

  return {
    subtotal: subTotal,
    totalWithIv: totalWithIv,
    discountCurrency: discountCurrency,
    subTotalNoDiscount: subTotalNoDiscount,
    priceToUse: price,
    discount: discount
  }

}

// updates an item in the cart with new information, this aux funtion returns new updated object ready for replace the stored one
function updatedCartItem(itemsInCart, index, newQty, productDiscount, predDiscount, client, uuid) {

  const data = caclSubtotal(itemsInCart[index].product, newQty, productDiscount)

  return {
    uuid: uuid,
    product: itemsInCart[index].product,
    discountCurrency: data.discountCurrency,
    qty: newQty,
    discount: data.discount,
    subTotalNoDiscount: data.subTotalNoDiscount,
    subtotal: data.subtotal,
    totalWithIv: data.totalWithIv,
    lote: itemsInCart[index].lote,
    priceToUse: data.priceToUse
  }
}

// function to determin price to use in calculation
// function priceToUse(product, client) {

//   if (client.clientType == 'GENERAL') return product.price

//   if (client.clientType == 'DISTRIB' && product.usePrice2) return product.price2
//   if (client.clientType == 'DISTRIB') return product.price

//   if (client.clientType == 'WHOLESA' && product.usePrice3) return product.price3
//   if (client.clientType == 'WHOLESA' && product.usePrice2) return product.price2
//   if (client.clientType == 'WHOLESA') return product.price

//   return product.price

// }

export function setProduct(kwargs, resolve, reject) {
  const lookUpValue = kwargs.lookUpValue
  const lookUpField = kwargs.lookUpField
  const lookUpField2 = kwargs.lookUpField2
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
      // TEMPORARY FIX O AGAIN TO BACKEND TO SEARCH BY BARCODE
      axios.get(`${url}?${lookUpField2}=${lookUpValue}`).then(function(response) {
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
          alertify.alert('Error', `No hay ${kwargs.modelName} con el valor de ${kwargs.lookUpName2}: ${kwargs.lookUpValue}`)
          reject()
        }

      }).catch(function(error) {
        alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
        administrador del sistema con el siguiete error: ${error}`)
        reject()
      })

    }

  }).catch(function(error) {
    alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
    administrador del sistema con el siguiete error: ${error}`)
    reject()
  })
}

export function setProductNew(kwargs, resolve, reject) {
  axios({
    method: 'post',
    url: kwargs.url,
    data: kwargs.data
  })
    .then((response) => {
      console.log(response)
      resolve(response.data)
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.data)
        alertify.alert('Error', `ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
      } else {
        console.log('NO CUSTOM ERROR')
        console.log(err)
        alertify.alert('Error', `ERROR: ${err}.`)
      }
      reject(err)
    })

}

export function getProductsList(kwargs, resolve, reject) {
  axios({
    method: 'post',
    url: kwargs.url,
    data: kwargs.data
  })
    .then((response) => {
      console.log(response)
      resolve(response.data)
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.data)
        alertify.alert('Error', `ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
      } else {
        console.log('NO CUSTOM ERROR')
        console.log(err)
        alertify.alert('Error', `ERROR: ${err}.`)
      }
      reject(err)
    })

}

export function determinPriceToUse(line, priceListSelected, usePriceListAsDefault) {

  const listSelected = parseInt(priceListSelected)
  // case where the price list is selected and use as default checked
  if (usePriceListAsDefault && line.target_price_list != 'table') {
    switch (listSelected) {
      case 1:
      {
        console.log('SETTED PRICE1')
        return parseFloat(line.product.price1)
      } // case
      case 2:
      {
        console.log('SETTED PRICE2')
        return parseFloat(line.product.price2)
      } // case
      case 3:
      {
        console.log('SETTED PRICE3')
        return parseFloat(line.product.price3)
      } // case
      default:
      {
        console.log('SETTED DEFAULT PRICE 1')
        return parseFloat(line.product.price1)
      }
    }
  }
  // IF THE LIST IS NOT SET IN FRONTEND USE BACKEND DATA
  switch (line.target_price_list) {
    case 'price1':
    {
      console.log('PRICE1')
      return parseFloat(line.product.price1)
    } // case
    case 'price2':
    {
      console.log('PRICE2')
      return parseFloat(line.product.price2)
    } // case
    case 'price3':
    {
      console.log('PRICE3')
      return parseFloat(line.product.price3)
    } // case
    case 'table':
    {
      console.log('TABLE')
      return parseFloat(line.table_price)
    } // case
    default:
    {
      console.log('DEFAULT PRICE 1')
      return parseFloat(line.product.price1)
    }
  }
}
