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

export function loadQuotation(url, resolve, reject) {
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
export function getPendingQuotations(kwargs) {

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

  const urltoFetch = `${url}/?${filterField}=${filter}&${filterField2}=${filter2}&${filterField3}=${filter3}&presale_type=QUOTING&ordering=${ordering}&limit=50`
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

export function setQuotationNull(id, resolve, reject) {
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
