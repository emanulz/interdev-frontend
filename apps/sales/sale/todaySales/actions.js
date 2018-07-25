// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'
import axios from 'axios'

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
export function getTodaySales(kwargs) {

  const url = kwargs.url
  const successType = kwargs.successType
  const errorType = kwargs.errorType
  const filter = kwargs.filter
  const filterField = kwargs.filterField
  const ordering = kwargs.ordering

  const urltoFetch = `${url}/?${filterField}=${filter}&ordering=${ordering}&limit=1000`
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
