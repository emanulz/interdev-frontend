// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------

import axios from 'axios'
import alertify from 'alertifyjs'

// ------------------------------------------------------------------------------------------
// SAVE FUNCTION
// ------------------------------------------------------------------------------------------
export function updateClient(kwargs, resolve, reject) {
  const item = kwargs.item
  const url = kwargs.url

  return function(dispatch) {

    axios({
      method: 'patch',
      url: url,
      data: item
    })
      .then((response) => {
        resolve(response.data)
      }).catch((err) => {
        console.log(err)
        reject(err)
      })

  }
}

export function updateClientLocal(kwargs, resolve, reject) {
  const item = kwargs.item
  const url = kwargs.url
  return function(dispatch) {
    axios({
      method: 'patch',
      url: url,
      data: item
    })
      .then((response) => {
        dispatch({type: kwargs.dispatchType, payload: ''})
        dispatch({type: 'FETCHING_DONE', payload: ''})
        resolve()
      }).catch((err) => {
        if (err.response) {
          console.log(err.response.data)
          alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
        } else {
          console.log('NO CUSTOM ERROR')
          console.log(err)
          alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err}.`)
            .set('onok', function() {
              return true
            })
        }
        reject(err)
        dispatch({type: 'FETCHING_DONE', payload: ''})
      })
  }
}
