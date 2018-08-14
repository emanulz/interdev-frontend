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

export function getProfileAndRelated() {

  const url = '/api/userprofiles/getProfileAndRelated/'

  return function(dispatch) {
    axios.get(url).then(function(response) {
      dispatch({type: 'FETCH_USER_PROFILE_FULFILLED', payload: response.data})
      dispatch({type: 'FETCHING_DONE', payload: ''})
    }).catch(function(error) {
      console.log(error.response.status)
      // IF THE ERROR IS UNAUTORIZED PAGE WILL SHOW THE MESSAGE
      if (error.response.status != 403) {
        alertify.alert('ERROR', `Error al obtener el perfil de usuario y datos del contribuyente, por favor recarge
        la página o comuniquese con el administrador del sistema con le siguiente error, ERROR: ${error}`)
        dispatch({type: 'FETCH_USER_PROFILE_REJECTED', payload: ''})
      }
    })
  }

}
