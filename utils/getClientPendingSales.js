// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

import axios from 'axios'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

// ------------------------------------------------------------------------------------------
// EXPORT FUNCTIONS
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// GET SALES, RETRIEVE WITH DEBT
// ------------------------------------------------------------------------------------------
export function getClientPendingSales(kwargs) {

  const url = kwargs.url
  const successType = kwargs.successType
  const errorType = kwargs.errorType
  const clientId = kwargs.clientId

  return function(dispatch) {
    axios.get(`${url}/?client_id=${clientId}&limit=400`).then(function(response) {
      const responseData = response.data.results.filter(item => {
        return item.balance > 0
      })
      // parse the items in JSON objects stored as strings
      const responseData2 = responseData.map(item => {
        const cart = JSON.parse(item.cart)
        const balance = parseFloat(item.balance)
        const client = JSON.parse(item.client)
        const pay = JSON.parse(item.pay)
        return {...item,
          cart: cart,
          client,
          pay: pay,
          balance: balance
        }
      })
      // Then Dispatch
      dispatch({type: successType, payload: responseData2})
      dispatch({type: 'FETCHING_DONE', payload: ''})
    }).catch(function(error) {
      // IF THE ERROR IS UNAUTORIZED PAGE WILL SHOW THE MESSAGE
      alertify.alert('ERROR', `Error al obtener un valor del API, por favor intente de nuevo o comuníquese con el
      administrador del sistema con el siguiete error: ${error}`)
      dispatch({type: errorType, payload: error})
    })
  }

}
