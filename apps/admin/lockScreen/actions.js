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

export function lockAdmin() {
  return function(dispatch) {
    axios.patch('/api/userprefs/admin__is_admin_locked/', {value: true}).then(function(response) {
      dispatch({type: 'TOGGLE_ADMIN_LOCKED', payload: ''})
    }).catch(function(error) {
      alertify.alert('ERROR', `Error al cambiar elemento del API, por favor intente de nuevo o comuníquese con el
      administrador del sistema con el siguiete error: ${error}`)
      dispatch({type: 'ERROR_LOCKING_ADMIN', payload: error})
    })
  }
}

export function unlockAdmin(pw) {
  return function(dispatch) {
    const data = JSON.stringify({pw: pw})
    // calls the function in backend to check if password is valid
    axios.post('/api/checkpassword/', data)
      .then(function(response) {
        if (response.data == 'True') {
          // If response is true password is valid, then save the setting in db and unlock
          axios.patch('/api/userprefs/admin__is_admin_locked/', {value: false}).then(function(response) {
            dispatch({type: 'TOGGLE_ADMIN_LOCKED', payload: ''})
          }).catch(function(error) {
            alertify.alert('ERROR', `Error al cambiar elemento del API, por favor intente de nuevo o comuníquese con el
            administrador del sistema con el siguiete error: ${error}`)
            dispatch({type: 'ERROR_LOCKING_ADMIN', payload: error})
          })

        } else {
          // if password is not valid send message
          alertify.alert('ERROR', `Contraseña inválida, intente de nuevo.`)
          dispatch({type: 'TOGGLE_ADMIN_LOCKED_FALSE', payload: ''})
        }
      })
      .catch(function(error) {
        alertify.alert('ERROR', `Error al intentar verificar la contraseña, por favor intente de nuevo o comuníquese con el
        administrador del sistema con el siguiete error: ${error}`)
        console.log(error)
      })
  }
}
