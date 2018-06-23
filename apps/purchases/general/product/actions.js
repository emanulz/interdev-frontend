// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
const uuidv1 = require('uuid/v1')
import axios from 'axios'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
import { inspect } from 'util'
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
  //const cartItems = cons
  console.log("update kwargs --> " +  inspect(kwargs))
  let itemsInCart = kwargs.itemsInCart
  console.log("IS UUID --> " + kwargs.is_search_uuid)
  const index = kwargs.is_search_uuid
  ?itemsInCart.findIndex(item=> item.uuid==kwargs.id)
  :itemsInCart.findIndex(item=> item.product.code == kwargs.id || item.product.barcode == kwargs.id)
  console.log("Index " + index)
  const ele = itemsInCart[index]
  console.log("ELEM --> " +  ele)
  const qtyNum = kwargs.qty==undefined?ele.qty:kwargs.qty //if -1 was received, keep the current qty

  console.log("Subtotal kwarg --> " + kwargs.subtotal)
  const subtotalNum = kwargs.subTotal==undefined?ele.subtotal:kwargs.subtotal
  
  //const newTu = kwargs.target_utility==undefined?ele.target_utility:kwargs.target_utility
  const  newTu = kwargs.target_utility
  const newTp = kwargs.target_price==undefined?ele.wanted_price_ivi:kwargs.target_price

  const updatePattern = newTu !== undefined ? 'byUtility' : 'byPrice'
  //get the amount of discount of this line
  const newDiscount = kwargs.discount == undefined?ele.discount:kwargs.discount

  //check wether or not this discount should be reflected on the cost
  const reflectOnCost = kwargs.applyToClient == undefined?ele.applyToClient:kwargs.applyToClient
  let unit_cost = subtotalNum/qtyNum

  if(isNaN(unit_cost)){
    unit_cost = 0
  }
  if(reflectOnCost){
    console.log("Reflect --> " +  reflectOnCost)
    unit_cost -= newDiscount
  }else{
    console.log("Do not reflect")
  }
  // const qtyNum = qty==-1?itemsInCart[index].qty:qty //if -1 was received, keep the current qty
  // const subtotalNum = subtotal==-1?itemsInCart[index].subtotal:subtotal//if -1 was received, keep the current subtotal
  // const newTu = tUtility==-1?itemsInCart[index].target_utility:tUtility
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
    applyToClient: reflectOnCost
  }

  const res = {
    type: 'UPDATE_CART',
    payload: {
      item: updatedCartItem(updateKwargs),
      index:index
    }
  }
  return res
}

function calculateRealUtility(cost, target_utility, target_price, 
  product, updatePattern,  utility_method, round_to_coin = 5){
  console.log('Calculate needed utility so that the price is whole')
  console.log("RAW COST --> " + cost)
  let wanted_price = 0

  console.log("UPDATE PATTERN --> " +  updatePattern)
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
  const default_discount = 1 - parseFloat(product.pred_discount)/100.0

  switch(updatePattern){
    case 'byUtility':
    {
      console.log('Target_utility' + target_utility)
      let target_price_no_tax = 0
      if(utility_method === 'cost_based'){
        target_price_no_tax = cost * (1+target_utility/100.0)
      }else{
        target_price_no_tax = cost / (1-(target_utility/100.0))
      }

      console.log('PRICE_NO_TAX --> ' + target_price_no_tax)
      let target_price_ivi = target_price_no_tax * total_tax_factor * default_discount
      console.log('TARGET_PRICE_NO_IVI --> ' + target_price_ivi)
      //trim decimals from the price
      let int_ivi_price = Math.round(target_price_ivi)
      console.log('INT_IVI_PRICE --> ' + int_ivi_price )
      //round to the nearest usable coin
      let coin_round_modulus = int_ivi_price % round_to_coin
      console.log('COIN_ROUND_MODULUS --> ' + coin_round_modulus)
      wanted_price = int_ivi_price - coin_round_modulus
      console.log('WANTED_PRICE --> ' + wanted_price)
      break
    }

    case 'byPrice':
    {

      let int_target_price = Math.round(target_price)
      let coin_round_modulus = int_target_price  % round_to_coin
      wanted_price = int_target_price - coin_round_modulus
      console.log("By Price --> " + wanted_price)
      break
    }
  }

  
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
        subtotal: parseFloat(product.cost),
        status: 'new',
        discount: 0,
        applyToClient: false,
        target_utility: product.utility * 100,
        real_utility: 0,
        wanted_price_ivi: parseFloat(product.sell_price)
      }
    }
    return res
  

}

// updates an item in the cart with new information, this aux funtion returns new updated object ready for replace the stored one
function updatedCartItem(kwargs) {

  //calculate the price data as needed
  const price_data = calculateRealUtility(kwargs.unit_cost, kwargs.newTUtility, kwargs.newTPrice, 
    kwargs.itemsInCart[kwargs.index].product, kwargs.updatePattern, 'price_based')
  //keep the subtotal de the same
  const uuid = kwargs.itemsInCart[kwargs.index].uuid
  let prod = kwargs.itemsInCart[kwargs.index].product
  prod.cost = kwargs.unit_cost
  return {
    uuid: uuid,
    product: prod,
    qty: kwargs.newQty,
    subtotal: kwargs.newSubTotal,
    discount: kwargs.discount,
    applyToClient: kwargs.applyToClient,
    target_utility: (price_data['real_utility']*100).toFixed(3),
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