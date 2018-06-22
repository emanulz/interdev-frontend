// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
const uuidv1 = require('uuid/v1')
import axios from 'axios'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
import { inspect } from 'util'
import { doesNotReject } from 'assert';
// ------------------------------------------------------------------------------------------
// EXPORT FUNCTIONS USED IN COMPONENTS
// ------------------------------------------------------------------------------------------

export function productSearchDoubleClick(item, dispatch){
  axios.get(`/api/products/${item}`).then(function(response) {
    dispatch(checkIfInCart(1, response.data))
    dispatch({type: 'productSearch_TOGGLE_SEARCH_PANEL', payload: response.data})
}).catch(function(error) {
    alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
    administrador del sistema con el siguiete error: ${error}`)
})
}

export function searchProduct(search_key, model, namespace, amount_requested){
  const data = {
      model: model,
      max_results: 15,
      search_key: `!${search_key}`
  }

  return function(dispatch){
      axios({
          method: 'post',
          url: '/api/search/search/',
          data: data
      }).then(response=>{
          if(response.data.length == 1){
              dispatch(checkIfInCart(amount_requested, response.data[0]))
              dispatch({type:"FETCHING_DONE"})
          }else if(response.data.length>1){
              dispatch({type:`${namespace}_TOGGLE_SEARCH_PANEL`})
              dispatch({type:"FETCHING_DONE"})
          }else{
              alertify.alert('AVISO', `No se encontrarón productos con ese código`)
              console.log("No results")
          }
      }).catch(err=>{
          alertify.alert('ERROR', `Ocurrió un error en la búsqueda, Error: ${err}`)
          console.log(err)
          if (err.response) {
            console.log(err.response.data)
          }
          dispatch({type: 'FETCHING_DONE', payload: ''})
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

  return {type: 'REPLACE_CART', payload: newCart}

}


// export function updateItem(search_key, is_search_uuid, itemsInCart, qty, subtotal, tUtility, targetPrice,){
export function updateItem(kwargs){
  //const cartItems = 
  let itemsInCart = kwargs.itemsInCart
  const index = kwargs.is_search_uuid
  ?itemsInCart.findIndex(item=> item.uuid==kwargs.search_key)
  :itemsInCart.findIndex(item=> item.product.code == kwargs.search_key || item.product.barcode == kwargs.search_key)
  const ele = itemsInCart[index]
  const qtyNum = kwargs.qty==undefined?ele.qty:kwargs.qty //if -1 was received, keep the current qty
  const subtotalNum = kwargs.subTotal==undefined?ele.subtotal:kwargs.subtotal
  const newTu = kwargs.target_utility==undefined?ele.target_utility:kwargs.target_utility
  
  // const qtyNum = qty==-1?itemsInCart[index].qty:qty //if -1 was received, keep the current qty
  // const subtotalNum = subtotal==-1?itemsInCart[index].subtotal:subtotal//if -1 was received, keep the current subtotal
  // const newTu = tUtility==-1?itemsInCart[index].target_utility:tUtility

  const res = {
    type: 'UPDATE_CART',
    payload: {
      item: updatedCartItem(cartItems, index, qtyNum, subtotalNum, newTu),
      index:index
    }
  }
  return res
}

function calculateRealUtility(cost, target_utility, utility_method, product, round_to_coin = 5){
  console.log('Calculate needed utility so that the price is whole')
  console.log("RAW COST --> " + cost)
  //determine all taxes to be applied to the product, if any
  let total_tax_fraction = 0
  console.log('Product --> ' + product.description)
  if(product.use_taxes){
    total_tax_fraction += product.taxes
  }
  if(product.use_taxes2){
    total_tax_fraction += product.taxes2
  }
  const total_tax_factor = 1 + total_tax_fraction / 100.0

  console.log('Target_utility' + target_utility)
  let target_price_no_tax = 0
  if(utility_method === 'cost_based'){
    target_price_no_tax = cost * (1+target_utility/100.0)
  }else{
    target_price_no_tax = cost / (1-(target_utility/100.0))
  }


  console.log('Total tax factor')
  console.log(total_tax_factor)
  //include a default discount on the product

  console.log('Pred discount')
  console.log(product.pred_discount)
  const default_discount = 1 - parseFloat(product.pred_discount)/100.0
  console.log(default_discount)
  
  console.log('PRICE_NO_TAX --> ' + target_price_no_tax)
  let target_price_ivi = target_price_no_tax * total_tax_factor * default_discount
  console.log('TARGET_PRICE_NO_IVI --> ' + target_price_ivi)
  //trim decimals from the price
  let int_ivi_price = Math.round(target_price_ivi)
  console.log('INT_IVI_PRICE --> ' + int_ivi_price )
  //round to the nearest usable coin
  let coin_round_modulus = int_ivi_price % round_to_coin
  console.log('COIN_ROUND_MODULUS --> ' + coin_round_modulus)
  let wanted_price = int_ivi_price - coin_round_modulus
  console.log('WANTED_PRICE --> ' + wanted_price)
  //back calculate new utility

  let real_utility = 0
  if(utility_method === 'cost_based'){
    real_utility = (wanted_price/(total_tax_factor*default_discount))/cost - 1
  }else{
    real_utility = 1- cost/(wanted_price/(total_tax_factor*default_discount))
  }

  console.log('REAL_UTILITY --> ' + real_utility)
  return {'real_utility': real_utility, 'new_price': wanted_price}

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
function checkIfInCart(qty, product) {

  // check if product in cart
  //const indexInCart = itemsInCart.findIndex(cart => cart.product.code == code || cart.product.barcode == code)

  
    const uuid = uuidv1()
    const res = {
      type: 'ADD_TO_CART',
      payload: {
        uuid: uuid,
        product: product,
        qty: qty,
        subtotal: 0,
        status: 'new',
        discount: 0,
        applyToClient: false,
        target_utility: product.utility * 100,
        real_utility: 0,
        wanted_price_ivi: 0
      }
    }
    return res
  

}

// updates an item in the cart with new information, this aux funtion returns new updated object ready for replace the stored one
function updatedCartItem(itemsInCart, index, newQty, newSubTotal, newTUtility) {

  //calculate the price data as needed
  const price_data = calculateRealUtility(newSubTotal/newQty, newTUtility, 'price_based',
                  itemsInCart[index].product)
  //keep the subtotal de the same
  const uuid = itemsInCart[index].uuid
  return {
    uuid: uuid,
    product: itemsInCart[index].product,
    qty: newQty,
    subtotal: newSubTotal,
    target_utility: newTUtility,
    real_utility: (price_data['real_utility']*100).toFixed(3),
    wanted_price_ivi: price_data['new_price'].toFixed(3),
    status:'modified'
  }
}

export function setProduct(kwargs, resolve, reject){
  const lookUpValue = kwargs.lookUpValue
  const lookUpField = kwargs.lookUpField
  const url = kwargs.url

  axios.get(`${url}?${lookUpField}=${lookUpValue}`).then(function(response) {

    if (response.data.results.length>0) {
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

  }).catch(function(error) {
    alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
    administrador del sistema con el siguiete error: ${error}`)
    reject()
  })
}