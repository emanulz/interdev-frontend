// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'
import axios from 'axios'

export function loadReturnToPrint(consecutive) {
  const url = `/api/returns/?consecutive=${consecutive}`
  return function(dispatch) {
    // GET THE RETURN AND DISPATCH
    axios.get(url).then(function(response) {
      // FIRST CLEAR REDUCER DATA
      dispatch({type: 'CLEAR_PRINT_RETURN_RETURN', payload: ''})

      if (response.data.count > 0) {
        // IF THERE IS MORE THAN ONE ELEMENT FILTERED
        if (response.data.count > 1) {
          alertify.alert('ATENCIÓN', `Existe mas de una devolución con el consecutivo:
          ${consecutive}, se utilizará la primera en lista, por lo que puede no ser la mismo que ud desea
          consultar, esto puede deberse a un error, por favor revise los
          datos o contacte con el administrador del sistema.`)
        }

        // THEN FETCH THE FULL RETURN

        const returnId = response.data.results[0].id
        const url2 = `/api/returns/${returnId}`
        axios.get(url2).then(function(response) {

          dispatch({type: 'SET_PRINT_RETURN_RETURN', payload: response.data})
          dispatch({type: 'FETCHING_DONE', payload: ''})
          dispatch({type: 'SHOW_PRINT_RETURN_PANEL', payload: ''})

        }).catch(function(error) { // ON ERROR FETCHING PRERETURN CLEAN ALL
          dispatch({type: 'CLEAR_PRINT_RETURN_RETURN', payload: ''})
          dispatch({type: 'FETCHING_DONE', payload: ''})
          alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
          administrador del sistema con el siguiete error: ${error}`)
        })

      // IF THERE ARE NOT RETURNS RESULTS
      } else {
        dispatch({type: 'CLEAR_PRINT_RETURN_RETURN', payload: ''})
        dispatch({type: 'CLEAR_PRINT_RETURN_PRERETURN', payload: ''})
        dispatch({type: 'FETCHING_DONE', payload: ''})
        alertify.alert('Error', `No se encontraron devoluciones con el valor de consecutivo: ${consecutive}`)
      }

    }).catch(function(error) { // ON ERROR FETCHING RETURN CLEAN ALL
      dispatch({type: 'CLEAR_PRINT_RETURN_RETURN', payload: ''})
      dispatch({type: 'CLEAR_PRINT_RETURN_PRERETURN', payload: ''})
      dispatch({type: 'FETCHING_DONE', payload: ''})
      alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
      administrador del sistema con el siguiete error: ${error}`)
    })
  }
}
