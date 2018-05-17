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
export function getInventoryMovements(kwargs) {

  const url = kwargs.url
  const successType = kwargs.successType
  const errorType = kwargs.errorType
  const productId = kwargs.productId
  const filterField = kwargs.filterField
  const ordering = kwargs.ordering

  return function(dispatch) {
    axios.get(`${url}/?${filterField}=${productId}&ordering=${ordering}`).then(function(response) {
      dispatch({type: successType, payload: response.data})
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
