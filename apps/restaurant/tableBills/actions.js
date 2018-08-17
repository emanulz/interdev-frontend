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

export function getItemDispatch(kwargs) {

  const url = kwargs.url
  const successType = kwargs.successType
  const errorType = kwargs.errorType

  return function(dispatch) {
    axios.get(url).then(function(response) {
      dispatch({type: successType, payload: response.data})
      dispatch({type: 'FETCHING_DONE', payload: ''})
    }).catch(function(error) {
      console.log(error.response.status)
      // IF THE ERROR IS UNAUTORIZED PAGE WILL SHOW THE MESSAGE
      dispatch({type: 'FETCHING_DONE'})
      if (error.response.status != 403) {
        alertify.alert('ERROR', `Error al obtener un valor del API, por favor intente de nuevo o comuníquese con el
        administrador del sistema con el siguiete error: ${error}`)
        dispatch({type: errorType, payload: error})
      }
    })
  }

}