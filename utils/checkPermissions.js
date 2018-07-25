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
export function checkUserPermissions(kwargs) {
  return function(dispatch) {
    const data = JSON.stringify({permissions: kwargs.permissions})
    // calls the function in backend to check permissions
    axios.post('/api/checkpermissions/', data)
      .then(function(response) {
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

// CHECK PERMISSION FOR AN PARTICULAR USER FUNCTION
export function checkSingleUserPermissions(kwargs) {
  return function(dispatch) {
    const data = JSON.stringify({permissions: kwargs.permissions, userId: kwargs.userId})
    // calls the function in backend to check permissions
    axios.post('/api/checksingleuserpermissions/', data)
      .then(function(response) {
        dispatch({type: 'FETCHING_DONE', payload: ''})
        dispatch({type: kwargs.success, payload: {permissions: response.data, model: kwargs.model}})
      })
      .catch(function(error) {
        alertify.alert('ERROR', `Error al intentar verificar los permiso del usuario Seleccionado, por favor intente de
        nuevo o comuníquese con el administrador del sistema con el siguiete error: ${error}`)
        dispatch({type: kwargs.fail, payload: ''})
      })
  }
}

// ASSING/QUIT SINGLE PERMISSION FUNCTION
export function assingUserPermission(kwargs, resolve, reject) {
  return function(dispatch) {
    const data = JSON.stringify(
      {permission: kwargs.permission, userId: kwargs.userId, add: kwargs.add}
    )
    console.log(data)
    // calls the function in backend to check permissions
    axios.post('/api/assinguserpermission/', data)
      .then(function(response) {
        console.log('SUCESSSS')
        console.log('response')
        resolve()
      })
      .catch(function(error) {
        console.log(error.message)
        alertify.alert('ERROR', `Error al assignar el permiso: ${error}`)
        reject()
        dispatch({type: 'FETCHING_DONE', payload: ''})
      })
  }
}
