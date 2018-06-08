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

export function loadPresale(id, sales) {
  const filteredSales = sales.filter(sale => {
    return sale._id == id
  })
  return function(dispatch) {
    if (filteredSales.length) {
      filteredSales[0]['created'] = new Date(filteredSales[0]['created'])
      // filteredSales[0]['globalDiscount'] = parseFloat(filteredSales[0]['globalDiscount'])
      document.getElementById('discountField').value = parseFloat(filteredSales[0]['cart']['globalDiscount'])
      filteredSales[0]['client']['saleLoaded'] = true

      dispatch({type: 'LOADED_PRESALE', payload: filteredSales[0]})
      // dispatch({type: 'LOADED_FALSE', payload: ''})
    } else {
      dispatch({type: 'NOT_FOUND_SALE', payload: id})
    }
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

  const urltoFetch = `${url}/?${filterField}=${filter}&${filterField2}=${filter2}&${filterField3}=${filter3}&ordering=${ordering}&limit=200`

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
