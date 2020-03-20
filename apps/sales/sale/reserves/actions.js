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

export function loadReserve(url, resolve, reject) {
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
export function getPendingReserves(kwargs) {

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

  const urltoFetch = `${url}/?${filterField}=${filter}&${filterField2}=${filter2}&${filterField3}=${filter3}&destroyed=False&presale_type=RESERVE&ordering=${ordering}&limit=50`
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

export function setReserveNull(id, resolve, reject) {
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

export function saveReserveItem(kwargs, resolve, reject) {
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
        console.log(err.response.data)
        if (err.response) {
          console.log(err.response.data)
          alertify.alert('Error', `Error al procesar la reserva, ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
        } else {
          console.log('NO CUSTOM ERROR')
          console.log(err)
          alertify.alert('Error', `Error al procesar la Reserva, ERROR: ${err}.`)
        }
        reject()
      })

  }
}
