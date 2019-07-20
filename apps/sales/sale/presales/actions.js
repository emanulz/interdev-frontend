// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'
import axios from 'axios'
import {getFullClientById} from '../../general/clients/actions.js'
const Mousetrap = require('mousetrap')

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
// ------------------------------------------------------------------------------------------
// GET PRESALES CLOSED, NOT NULL AND NOT BILLED
// ------------------------------------------------------------------------------------------
export function getPendingPresales(kwargs) {

  const url = kwargs.url
  const successType = kwargs.successType
  const errorType = kwargs.errorType
  const filter = kwargs.filter
  const filterField = kwargs.filterField
  const filter2 = kwargs.filter2
  const filterField2 = kwargs.filterField2
  const filter3 = kwargs.filter3
  const filterField3 = kwargs.filterField3
  const ordering = kwargs.ordering

  const urltoFetch = `${url}/?${filterField}=${filter}&${filterField2}=${filter2}&${filterField3}=${filter3}&presale_type=REGULAR&ordering=${ordering}&limit=200`
  console.log(urltoFetch)
  return function(dispatch) {
    axios.get(urltoFetch).then(function(response) {
      dispatch({type: successType, payload: response.data.results})
      dispatch({type: 'FETCHING_DONE', payload: ''})
    }).catch(function(error) {
      // IF THE ERROR IS UNAUTORIZED PAGE WILL SHOW THE MESSAGE
      if (error.response.status != 403) {
        alertify.alert('ERROR', `Error al obtener un valor del API, por favor intente de nuevo o comuníquese con el
        administrador del sistema con el siguiete error: ${error}`)
        dispatch({type: errorType, payload: error})
      }
    })
  }

}

export function setPresaleNull(id, resolve, reject) {
  const url = `/api/presalespatch/${id}/set_null/`
  axios({
    method: 'post',
    url: url,
    data: {}
  }).then((response) => {
    resolve(response.data)
  }).catch((err) => {
    reject(err)
  })
}

export function loadPresaleItem(id, dispatch) {

  Mousetrap.unbind('enter')
  const url = `/api/presales/${id}`
  const loadPromise = new Promise((resolve, reject) => {
    dispatch({type: 'FETCHING_STARTED', payload: ''})
    dispatch(loadPresale(url, resolve, reject))
  })
  loadPromise.then((data) => {
    console.log('PRESALEEE', data)
    dispatch({type: 'HIDE_PRESALES_PANEL', payload: -1})
    dispatch({type: 'FETCHING_DONE', payload: ''})
    data.cart = JSON.parse(data.cart)
    data.client = JSON.parse(data.client)
    data.user = JSON.parse(data.user)
    try {
      data.extras = JSON.parse(data.extras)
      dispatch({type: 'SET_CURRENCY', payload: data.currency_code})
    } catch (err) { data.extras = null }
    // _this.props.dispatch({type: 'CLIENT_SELECTED', payload: data.client})
    dispatch({type: 'SET_PRESALE_ID', payload: data.id})
    // IF it is quotation do as needed
    dispatch({type: 'LOAD_CART', payload: checkAndFixCartIVA(data.cart)})
    dispatch({type: 'PRESALE_LOADED', payload: data.user})
    dispatch({type: 'SET_PRESALE_USER', payload: data.user})
    dispatch({type: 'SET_PRESALE_EXTRAS', payload: data.extras})
    dispatch({type: 'CLEAR_PAY', payload: ''})
    if (data.presale_type == 'QUOTING') {
      dispatch({type: 'SET_QUOTATION_ID', payload: data.id})
      dispatch({type: 'HIDE_QUOTATIONS_PANEL', payload: -1})
      dispatch({type: 'QUOTATION_LOADED', payload: data.user})
    }
    if (data.cart.isExempt) {
      // alert('EXONERADAAAA')
      // console.log('EXEMP DATA', data.cart.exemption_data)
      try {
        dispatch({type: 'SET_EXEMPTION_DATA', payload: data.cart.exemption_data})
        dispatch({type: 'EXEMPT_SALE', payload: true})
        dispatch({type: 'SET_SALE_EXEMPT', payload: true})
      } catch (err) {
        alertify.alert('ERROR', 'Error al cargar la exoneración del Elemento, por favor exonere de manera manual.')
      }
    }
    getFullClientById(data.client.id, dispatch)
    document.getElementById('sale-facturar-btn').focus()
    Mousetrap.unbind('enter')
  }).catch((err) => {
    if (err.response) {
      alertify.alert('ERROR', `${err.response.data}`)
    } else {
      alertify.alert('ERROR', `Hubo un error al cargar el elemento, error: ${err}`)
    }
    dispatch({type: 'FETCHING_DONE', payload: ''})
  })
}

function checkAndFixCartIVA(cart) {
  cart.cartItems.forEach(line => {
    if (!line.product.taxes_IVA) {
      line.product.tax_code_IVA = '01'
      if (parseFloat(line.product.taxes) == 0 || !line.product.use_taxes) {
        line.product.rate_code_IVA = '01'
        line.product.taxes_IVA = '0.00000'
      } else {
        line.product.rate_code_IVA = '08'
        line.product.taxes_IVA = '13.00000'
      }
    }
  })
  return cart
}
