// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'
import axios from 'axios'

export function loadRequestToPrint(consecutive) {
  const url = `/api/requests/?consecutive=${consecutive}`

  return function(dispatch) {
    // GET THE SALE AND DISPATCH
    axios.get(url).then(function(response) {
      // FIRST CLEAR REDUCER DATA
      dispatch({type: 'CLEAR_PRINT_REQUEST', payload: ''})

      if (response.data.count > 0) {
        // IF THERE IS MORE THAN ONE ELEMENT FILTERED
        if (response.data.count > 1) {
          alertify.alert('ATENCIÓN', `Existe mas de una orden de cotización con el consecutivo:
          ${consecutive}, se utilizará la primera en lista, por lo que puede no ser la mismo que ud desea
          consultar, esto puede deberse a un error, por favor revise los
          datos o contacte con el administrador del sistema.`)
        }

        dispatch({type: 'SET_PRINT_REQUEST', payload: response.data.results[0]})
        // THEN IF THERE IS A REQUEST, FETCH IT AND DISPATCH
        dispatch({type: 'FETCHING_DONE', payload: ''})
        dispatch({type: 'SHOW_PRINT_REQUEST_PANEL', payload: ''})

      // IF THERE ARE NOT SALES RESULTS
      } else {
        dispatch({type: 'CLEAR_PRINT_REQUEST', payload: ''})
        dispatch({type: 'FETCHING_DONE', payload: ''})
        alertify.alert('Error', `No se encontraron órdenes de cotización con el valor de consecutivo: ${consecutive}`)
      }

    }).catch(function(error) { // ON ERROR FETCHING SALE CLEAN ALL
      dispatch({type: 'CLEAR_PRINT_REQUEST', payload: ''})
      dispatch({type: 'FETCHING_DONE', payload: ''})
      alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
      administrador del sistema con el siguiete error: ${error}`)
    })
  }
}
