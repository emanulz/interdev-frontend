// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------

import axios from 'axios'
import alertify from 'alertifyjs'

// ------------------------------------------------------------------------------------------
// CONFIG DEFAULT AXIOS
// ------------------------------------------------------------------------------------------

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

// ------------------------------------------------------------------------------------------
// EXPORT FUNCTIONS
// ------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------
// SAVE PAYMENT FUNCTION
// ------------------------------------------------------------------------------------------
export function savePayment(kwargs, resolve, reject) {
  const item = kwargs.item
  delete item['id']
  const url = kwargs.url
  return function(dispatch) {
    axios({
      method: 'post',
      url: url,
      data: item
    })
      .then((response) => {
        resolve(response.data)
      }).catch((err) => {
        if (err.response) {
          console.log(err.response.data)
        }
        reject()
      })

  }
}

// ------------------------------------------------------------------------------------------
// SAVE MOVEMENT FUNCTION
// ------------------------------------------------------------------------------------------
export function saveMovement(kwargs, resolve, reject) {
  const item = kwargs.item
  delete item['id']
  const url = kwargs.url
  return function(dispatch) {
    axios({
      method: 'post',
      url: url,
      data: item
    })
      .then((response) => {
        resolve()
      }).catch((err) => {
        if (err.response) {
          console.log(err.response.data)
        }
        reject()
      })

  }
}

// ------------------------------------------------------------------------------------------
// GET FUNCTIONS (RETRIEVE ALL)
// ------------------------------------------------------------------------------------------
export function getPaymentDispatch(kwargs) {

  const url = kwargs.url
  const successType = kwargs.successType
  const errorType = kwargs.errorType

  return function(dispatch) {
    axios.get(url).then(function(response) {
      dispatch({type: successType, payload: response.data})
      dispatch({type: 'FETCHING_DONE', payload: ''})
    }).catch(function(error) {
      console.log(error.response.status)
      // IF THE ERROR IS UNAUTORIZED PAGE WILL SHOW THE MESSAGE
      if (error.response.status != 403) {
        alertify.alert('ERROR', `Error al obtener un valor del API, por favor intente de nuevo o comuníquese con el
        administrador del sistema con el siguiete error: ${error}`)
        dispatch({type: errorType, payload: error})
      }
    })
  }

}

export function getClientVouchers(kwargs) {

  const url = kwargs.url
  const successType = kwargs.successType
  const errorType = kwargs.errorType

  return function(dispatch) {
    axios.get(url).then(function(response) {
      dispatch({type: successType, payload: response.data.credit_vouchers})
      dispatch({type: 'FETCHING_DONE', payload: ''})
    }).catch(function(err) {
      console.log(err.response.status)
      // IF THE ERROR IS UNAUTORIZED PAGE WILL SHOW THE MESSAGE
      if (err.response.status != 403) {
        if (err.response) {
          console.log(err.response.data)
          alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
        } else {
          console.log('NO CUSTOM ERROR')
          console.log(err)
          alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err}.`)
        }
        dispatch({type: errorType, payload: err})
        dispatch({type: 'FETCHING_DONE', payload: ''})
      }
    })
  }

}
