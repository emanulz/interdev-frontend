// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

import axios from 'axios'

// ------------------------------------------------------------------------------------------
// CONFIG DEFAULT AXIOS
// ------------------------------------------------------------------------------------------

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

// ------------------------------------------------------------------------------------------
// UPLOAD FUNCTION
// ------------------------------------------------------------------------------------------
export function uploadEPurchase(kwargs) {
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
        alertify.alert('Completado', kwargs.sucessMessage)
        console.log(response.data)
        dispatch({type: 'SET_EPURCHASE', payload: response.data})
        dispatch({type: 'FETCHING_DONE', payload: ''})
      }).catch((err) => {
        if (err.response) {
          console.log(err.response.data)
          alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
        } else {
          console.log('NO CUSTOM ERROR')
          console.log(err)
          alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err}.`)
        }
        dispatch({type: 'FETCHING_DONE', payload: ''})
      })

  }
}

// ------------------------------------------------------------------------------------------
// UPLOAD FUNCTION
// ------------------------------------------------------------------------------------------
export function acceptEPurchase(kwargs) {
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
        alertify.alert('Completado', kwargs.sucessMessage)
        console.log(response.data)
        dispatch({type: 'FETCHING_DONE', payload: ''})
      }).catch((err) => {
        if (err.response) {
          console.log(err.response.data)
          alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
        } else {
          console.log('NO CUSTOM ERROR')
          console.log(err)
          alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err}.`)
        }
        dispatch({type: 'FETCHING_DONE', payload: ''})
      })

  }
}
