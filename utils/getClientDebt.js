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

// CHECK PERMISSIONS FOR CURRENT USER
export function getClientDebt(kwargs) {
  return function(dispatch) {
    const data = JSON.stringify({client_id: kwargs.client_id})
    // calls the function in backend to check permissions
    axios.post('/api/getclientdebt/', data)
      .then(function(response) {
        console.log(response)
        dispatch({type: 'FETCHING_DONE', payload: ''})
        dispatch({type: kwargs.success, payload: response.data})
      })
      .catch(function(error) {
        alertify.alert('ERROR', `Error al intentar verificar los permisos de usuario, por favor intente de nuevo o comuníquese con el
        administrador del sistema con el siguiete error: ${error}`)
        dispatch({type: kwargs.fail, payload: ''})
      })
  }
}
