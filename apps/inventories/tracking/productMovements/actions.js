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
  const filter = kwargs.filter
  const filterField = kwargs.filterField
  const filter2 = kwargs.filter2
  const filterField2 = kwargs.filterField2
  const ordering = kwargs.ordering

  const urltoFetch = kwargs.filter2
    ? `${url}/?${filterField}=${filter}&${filterField2}=${filter2}&ordering=${ordering}&limit=20`
    : `${url}/?${filterField}=${filter}&ordering=${ordering}&limit=20`
  console.log(urltoFetch)
  return function(dispatch) {
    axios.get(urltoFetch).then(function(response) {
      dispatch({type: successType, payload: response.data.results})
      dispatch({type: 'SET_INVENTORY_MOVEMENTS_PREV_NEXT', payload: {next: response.data.next, previous: response.data.previous}})
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

export function getInventoryMovementsUrl(kwargs) {

  const url = kwargs.url
  const successType = kwargs.successType
  const errorType = kwargs.errorType
  return function(dispatch) {
    axios.get(url).then(function(response) {
      dispatch({type: successType, payload: response.data.results})
      dispatch({type: 'SET_INVENTORY_MOVEMENTS_PREV_NEXT', payload: {next: response.data.next, previous: response.data.previous}})
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
