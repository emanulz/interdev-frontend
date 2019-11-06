// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'
import axios from 'axios'

export function loadRegisterMovementToPrintId(registerMovementId) {
  const url = `/api/registermovements/${registerMovementId}`

  return function(dispatch) {
    // GET THE ADVANCE AND DISPATCH
    axios.get(url).then(function(response) {
      // FIRST CLEAR REDUCER DATA
      dispatch({type: 'CLEAR_PRINT_MANUAL_REGISTER_MOVEMENT', payload: ''})
      dispatch({type: 'CLEAR_PRINT_MANUAL_REGISTER_MOVEMENT_CLOSURE', payload: ''})

      if (response.data) {
        // IF THERE IS MORE THAN ONE ELEMENT FILTERE
        dispatch({type: 'SET_PRINT_MANUAL_REGISTER_MOVEMENT', payload: response.data})
        // THEN IF THERE IS A VOUCHER, FETCH IT AND DISPATCH
        if (response.data.register_closure_id) {
          const url2 = `/api/registerclosure/${response.data.register_closure_id}`
          axios.get(url2).then(function(response) {

            dispatch({type: 'SET_PRINT_MANUAL_REGISTER_MOVEMENT_CLOSURE', payload: response.data})
            dispatch({type: 'FETCHING_DONE', payload: ''})
            dispatch({type: 'SHOW_PRINT_MANUAL_REGISTER_MOVEMENT_PANEL', payload: ''})

          }).catch(function(error) { // ON ERROR FETCHING VOUCHER CLEAN ALL
            dispatch({type: 'CLEAR_PRINT_MANUAL_REGISTER_MOVEMENT', payload: ''})
            dispatch({type: 'CLEAR_PRINT_MANUAL_REGISTER_MOVEMENT_CLOSURE', payload: ''})
            dispatch({type: 'FETCHING_DONE', payload: ''})
            alertify.alert('ERROR', `Error al obtener el valor del API para imprimir el Movimiento, por favor intente de nuevo o comuníquese con el
            administrador del sistema con el siguiete error: ${error}`)
          })
        // IF THERE IS NO VOUCHER ID
        } else {
          dispatch({type: 'FETCHING_DONE', payload: ''})
          dispatch({type: 'SHOW_PRINT_MANUAL_REGISTER_MOVEMENT_PANEL', payload: ''})
        }
      // IF THERE ARE NOT ADVANCES RESULTS
      } else {
        dispatch({type: 'CLEAR_PRINT_MANUAL_REGISTER_MOVEMENT', payload: ''})
        dispatch({type: 'CLEAR_PRINT_MANUAL_REGISTER_MOVEMENT_CLOSURE', payload: ''})
        dispatch({type: 'FETCHING_DONE', payload: ''})
        alertify.alert('Error', `No se encontraron movimientos de cierre de caja manuales ventas con el valor de ID: ${registerMovementId}`)
      }

    }).catch(function(error) { // ON ERROR FETCHING ADVANCE CLEAN ALL
      dispatch({type: 'CLEAR_PRINT_CASH_ADVANCE_ADVANCE', payload: ''})
      dispatch({type: 'CLEAR_PRINT_CASH_ADVANCE_VOUCHER', payload: ''})
      dispatch({type: 'FETCHING_DONE', payload: ''})
      alertify.alert('ERROR', `Error al obtener el valor del API para imprimir el Movimiento, por favor intente de nuevo o comuníquese con el
      administrador del sistema con el siguiete error: ${error}`)
    })
  }
}
