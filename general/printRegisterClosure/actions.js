// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'
import axios from 'axios'

export function loadRegisterClosureToPrint(id) {
  const url = `/api/registerclosure/${id}`
  return function(dispatch) {
    // GET THE REGISTER_CLOSURE AND DISPATCH
    axios.get(url).then(function(response) {
      // FIRST CLEAR REDUCER DATA
      dispatch({type: 'CLEAR_PRINT_REGISTER_CLOSURE_REGISTER_CLOSURE', payload: ''})

      if (response.data) {
        // IF THERE IS MORE THAN ONE ELEMENT FILTER
        dispatch({type: 'SET_PRINT_REGISTER_CLOSURE_REGISTER_CLOSURE', payload: response.data})
        dispatch({type: 'FETCHING_DONE', payload: ''})
        dispatch({type: 'SHOW_PRINT_REGISTER_CLOSURE_PANEL', payload: ''})

      // IF THERE ARE NOT REGISTER_CLOSURES RESULTS
      } else {
        dispatch({type: 'CLEAR_PRINT_REGISTER_CLOSURE_REGISTER_CLOSURE', payload: ''})
        dispatch({type: 'CLEAR_PRINT_REGISTER_CLOSURE_PREREGISTER_CLOSURE', payload: ''})
        dispatch({type: 'FETCHING_DONE', payload: ''})
        alertify.alert('Error', `No se encontraron cierres de caja con el valor de identificador: ${id}`)
      }

    }).catch(function(error) { // ON ERROR FETCHING REGISTER_CLOSURE CLEAN ALL
      dispatch({type: 'CLEAR_PRINT_REGISTER_CLOSURE_REGISTER_CLOSURE', payload: ''})
      dispatch({type: 'CLEAR_PRINT_REGISTER_CLOSURE_PREREGISTER_CLOSURE', payload: ''})
      dispatch({type: 'FETCHING_DONE', payload: ''})
      alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
      administrador del sistema con el siguiete error: ${error}`)
    })
  }
}
