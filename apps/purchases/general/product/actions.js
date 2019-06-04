// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import axios from 'axios'
import alertify from 'alertifyjs'
const uuidv1 = require('uuid/v1')
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

// ------------------------------------------------------------------------------------------
// EXPORT FUNCTIONS USED IN COMPONENTS
// ------------------------------------------------------------------------------------------

export function productSearchDoubleClick(item, dispatch, data) {
  const cartItems = this.cartItems
  axios.get(`/api/products/${item}`).then(function (response) {
    dispatch(checkIfInCart(1, response.data, cartItems))
    dispatch({ type: 'productSearch_TOGGLE_SEARCH_PANEL', payload: response.data })
  }).catch(function (error) {
    alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
    administrador del sistema con el siguiete error: ${error}`)
  })
}

export function searchProduct(search_key, model, namespace, amount_requested, cartItems) {
  const data = {
    model: model,
    max_results: 15,
    search_key: `!${search_key}`
  }

  return function (dispatch) {
    axios({
      method: 'post',
      url: '/api/search/search/',
      data: data
    }).then(response => {
      if (response.data.length == 1) {
        dispatch(checkIfInCart(amount_requested, response.data[0], cartItems))
        dispatch({ type: 'FETCHING_DONE' })
      } else if (response.data.length > 1) {
        dispatch({ type: `${namespace}_TOGGLE_SEARCH_PANEL` })
        dispatch({ type: 'FETCHING_DONE' })
      } else {
        alertify.alert('AVISO', `No se encontrarón productos con ese código`)
        console.log('No results')
      }
    }).catch(err => {
      alertify.alert('ERROR', `Ocurrió un error en la búsqueda, Error: ${err}`)
      console.log(err)
      if (err.response) {
        console.log(err.response.data)
      }
      dispatch({ type: 'FETCHING_DONE', payload: '' })
    })
  }
}

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

  return { type: 'REPLACE_CART', payload: newCart }

}

// export function updateItem(search_key, is_search_uuid, itemsInCart, qty, subtotal, tUtility, targetPrice,){
export function updateItem(kwargs) {
  console.log('updateItem XMLVerision: ', kwargs.XMLVersion)

  const itemsInCart = kwargs.itemsInCart
  const index = kwargs.is_search_uuid
    ? itemsInCart.findIndex(item => item.uuid == kwargs.id)
    : itemsInCart.findIndex(item => item.product.code == kwargs.id || item.product.barcode == kwargs.id)
  const ele = itemsInCart[index]

  const qtyNum = kwargs.qty == undefined ? ele.qty : kwargs.qty // if -1 was received, keep the current qty

  const subtotalNum = kwargs.subtotal == undefined ? ele.subtotal : kwargs.subtotal
  // const newTu = kwargs.target_utility==undefined?ele.target_utility:kwargs.target_utility
  const newTu = kwargs.target_utility

  const newTp = kwargs.target_price == undefined ? ele.wanted_price_ivi : kwargs.target_price

  const updatePattern = newTu !== undefined ? 'byUtility' : 'byPrice'
  // get the amount of discount of this line
  const newDiscount = kwargs.discount == undefined ? ele.discount : kwargs.discount

  // check wether or not this discount should be reflected on the cost
  const reflectOnCost = kwargs.applyToClient == undefined ? ele.applyToClient : kwargs.applyToClient
  let unit_cost = subtotalNum / qtyNum

  // calculate the amount of the transport that this line shuld assume
  const total_line_transport = subtotalNum / kwargs.cartSubtotal * kwargs.orderTransport
  const transport_per_line_item = total_line_transport / qtyNum

  if (isNaN(unit_cost)) {
    unit_cost = 0
  }

  // add the per unit transport cost to the unit_cost
  unit_cost += transport_per_line_item
  if (reflectOnCost) {
    if (kwargs.discount_mode === 'percent_based') {
      unit_cost -= (newDiscount / 100.0 * kwargs.itemsInCart[index].subtotal) / qtyNum
    } else {
      unit_cost -= newDiscount / qtyNum
    }

  }

  const updateKwargs = {
    itemsInCart: itemsInCart,
    index: index,
    newQty: qtyNum,
    newSubTotal: subtotalNum,
    newTUtility: newTu,
    newTPrice: newTp,
    unit_cost: unit_cost,
    updatePattern: updatePattern,
    discount: newDiscount,
    applyToClient: reflectOnCost,
    transport_cost: transport_per_line_item,
    XMLVersion: kwargs.XMLVersion
  }

  const res = {
    type: 'UPDATE_CART',
    payload: {
      item: updatedCartItem(updateKwargs),
      index: index
    }
  }
  return res
}

export function calculateRealUtility(cost, target_utility, target_price,
  product, updatePattern, utility_method, XMLVersion, round_to_coin = 5) {
  console.log('calculateRealUtility XMLVerision: ', XMLVersion)
  let wanted_price = 0
  let total_tax_fraction = 0

  // determine all taxes to be applied to the product, if any
  if (XMLVersion == '4.2' || XMLVersion == '') {
    if (product.use_taxes) {
      total_tax_fraction += parseFloat(product.taxes)
    }
    if (product.use_taxes2) {
      total_tax_fraction += parseFloat(product.taxes2)
    }
  } else if (XMLVersion == '4.3') {
    total_tax_fraction += parseFloat(product.taxes_IVA)
  } else {
    alertify.alert('ERROR', 'No se pudo leer la version activa del formato XML, los impuestos no se sumaran, por lo que el total puede estar inválido.')
  }

  const total_tax_factor = 1 + total_tax_fraction / 100.0
  const default_discount = 1 - parseFloat(product.pred_discount) / 100.0

  switch (updatePattern) {
    case 'byUtility':
    {
      let target_price_no_tax = 0
      if (utility_method === 'cost_based') {
        target_price_no_tax = cost * (1 + target_utility / 100.0)
      } else {
        target_price_no_tax = cost / (1 - (target_utility / 100.0))
      }

      let target_price_ivi = target_price_no_tax * total_tax_factor * default_discount
      // trim decimals from the price
      let int_ivi_price = target_price_ivi
      if (product.use_coin_round) {
        int_ivi_price = Math.round(int_ivi_price)
      }

      // round to the nearest usable coin
      let coin_round_modulus = 0
      if (product.use_coin_round) {
        coin_round_modulus = int_ivi_price % round_to_coin
      }

      wanted_price = int_ivi_price - coin_round_modulus
      console.log('Wanted price --> ', wanted_price)

      break
    }

    case 'byPrice':
    {
      let int_target_price = target_price
      let coin_round_modulus = 0
      if (product.use_coin_round) {
        int_target_price = Math.round(int_target_price)
        coin_round_modulus = int_target_price % round_to_coin
      }

      wanted_price = int_target_price - coin_round_modulus
      break
    }
  }

  // back calculate new utility
  let real_utility = 0
  if (utility_method === 'cost_based') {
    real_utility = (wanted_price / (total_tax_factor * default_discount)) / cost - 1
  } else {
    real_utility = 1 - cost / (wanted_price / (total_tax_factor * default_discount))
  }

  return { 'real_utility': real_utility, 'new_price': wanted_price }

}

// ------------------------------------------------------------------------------------------
// LOCAL AUX FUNCTIONS
// ------------------------------------------------------------------------------------------

// checks in cart if item already exists
function checkIfInCart(qty, product, cartItems) {
  let index = cartItems.findIndex(a => a.product.code == product.code)
  if (index !== -1) {
    return { type: 'PRODUCT_ALREADY_IN_CART', payload: product.code }
  }
  // check if product in cart
  // const indexInCart = itemsInCart.findIndex(cart => cart.product.code == code || cart.product.barcode == code)

  const uuid = uuidv1()
  const res = {
    type: 'ADD_TO_CART',
    payload: {
      uuid: uuid,
      product: product,
      qty: qty,
      subtotal: parseFloat(product.cost),
      status: 'new',
      discount: 0,
      cost: 0,
      applyToClient: false,
      target_utility: product.utility * 100,
      transport_cost: 0,
      real_utility: 0,
      wanted_price_ivi: parseFloat(product.sell_price1)
    }
  }
  return res

}

// updates an item in the cart with new information, this aux funtion returns new updated object ready for replace the stored one
function updatedCartItem(kwargs) {
  console.log('updatedCartItem XMLVerision: ', kwargs.XMLVersion)
  // calculate the price data as needed
  const price_data = calculateRealUtility(kwargs.unit_cost, kwargs.newTUtility, kwargs.newTPrice,
    kwargs.itemsInCart[kwargs.index].product, kwargs.updatePattern, 'price_based', kwargs.XMLVersion)
  console.log('Price data final calcs --> ', price_data)
  // keep the subtotal the same
  const uuid = kwargs.itemsInCart[kwargs.index].uuid
  const prod = kwargs.itemsInCart[kwargs.index].product

  return {
    uuid: uuid,
    product: prod,
    cost: kwargs.unit_cost,
    qty: kwargs.newQty,
    subtotal: kwargs.newSubTotal,
    discount: kwargs.discount,
    applyToClient: kwargs.applyToClient,
    target_utility: (price_data['real_utility'] * 100).toFixed(3),
    real_utility: (price_data['real_utility'] * 100).toFixed(3),
    wanted_price_ivi: price_data['new_price'].toFixed(3),
    transport_cost: kwargs.transport_cost,
    status: 'modified'
  }
}

export function setProduct(kwargs, resolve, reject) {
  const lookUpValue = kwargs.lookUpValue
  const lookUpField = kwargs.lookUpField
  const url = kwargs.url

  axios.get(`${url}?${lookUpField}=${lookUpValue}`).then(function (response) {

    if (response.data.results.length > 0) {
      // IF THERE IS MORE THAN ONE ELEMENT FILTERED
      if (response.data.results.length > 1) {
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

  }).catch(function (error) {
    alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
    administrador del sistema con el siguiete error: ${error}`)
    reject()
  })
}