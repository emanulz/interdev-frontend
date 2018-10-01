// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import axios from 'axios'
import alertify from 'alertifyjs'
import {getFullClientById} from '../../sales/general/clients/actions.js'

// ------------------------------------------------------------------------------------------
// EXPORT FUNCTIONS
// ------------------------------------------------------------------------------------------
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

export function loadPresale(url, resolve, reject) {
  return function() {
    axios.get(url).then(function(response) {
      resolve(response.data)
    }).catch(function(error) {
      reject(error)
    })
  }
}

export function loadPresaleItem(id, dispatch) {

  const cartTemplate = {
    editable: true,
    created: '',
    updated: '',
    isNull: false,
    cartHasItems: false, // var to check if cart has items
    cartItems: [], // the list of items in cart
    cartSubtotalNoDiscount: 0, // subtotal without discount and taxes
    cartSubtotal: 0, // the subtotal including discounts without taxes
    cartTaxes: 0, // total amount of taxes in cart in currency
    cartExemptAmount: 0, // total amount of exempt in cart in currency
    cartTotal: 0, // cart total after discount and taxes
    globalDiscount: 0, // discount %
    discountTotal: 0, // discount in currency
    cartItemActive: false,
    totalNotRounded: 0,
    exemptionDocument: '',
    isExempt: false
  }

  const url = `/api/presales/${id}`
  const loadPromise = new Promise((resolve, reject) => {
    dispatch({type: 'FETCHING_STARTED', payload: ''})
    dispatch(loadPresale(url, resolve, reject))
  })
  loadPromise.then((data) => {
    console.log(data)
    dispatch({type: 'FETCHING_DONE', payload: ''})
    data.client = JSON.parse(data.client)
    data.user = JSON.parse(data.user)
    try {
      data.cart = JSON.parse(data.cart)
    } catch (err) {
      data.cart = cartTemplate
    }
    try {
      data.extras = JSON.parse(data.extras)
    } catch (err) {
      data.extras = null
    }
    // _dispatch({type: 'CLIENT_SELECTED', payload: data.client})
    dispatch({type: 'SET_PRESALE_ID', payload: data.id})
    dispatch({type: 'LOAD_CART', payload: data.cart})
    dispatch({type: 'SET_PRESALE_USER', payload: data.user})
    dispatch({type: 'SET_PRESALE_EXTRAS', payload: data.extras})
    getFullClientById(data.client.id, dispatch)
  }).catch((err) => {
    if (err.response) {
      alertify.alert('ERROR', `${err.response.data}`)
    } else {
      alertify.alert('ERROR', `Hubo un error al cargar la preventa, error: ${err}`)
    }
    dispatch({type: 'FETCHING_DONE', payload: ''})
  })
}
// *******************************************************************
