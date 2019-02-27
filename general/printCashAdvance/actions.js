// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'
import axios from 'axios'

export function loadCashAdvanceToPrint(consecutive) {
  const url = `/api/cashadvances/?consecutive=${consecutive}`

  return function(dispatch) {
    // GET THE ADVANCE AND DISPATCH
    axios.get(url).then(function(response) {
      // FIRST CLEAR REDUCER DATA
      dispatch({type: 'CLEAR_PRINT_CASH_ADVANCE_ADVANCE', payload: ''})
      dispatch({type: 'CLEAR_PRINT_CASH_ADVANCE_VOUCHER', payload: ''})

      if (response.data.count > 0) {
        // IF THERE IS MORE THAN ONE ELEMENT FILTERED
        if (response.data.count > 1) {
          alertify.alert('ATENCIÓN', `Existe mas de un adelanto de efectivo con el consecutivo:
          ${consecutive}, se utilizará el primero en lista, por lo que puede no ser la mismo que ud desea
          consultar, esto puede deberse a un error, por favor revise los
          datos o contacte con el administrador del sistema.`)
        }

        dispatch({type: 'SET_PRINT_CASH_ADVANCE_ADVANCE', payload: response.data.results[0]})
        // THEN IF THERE IS A VOUCHER, FETCH IT AND DISPATCH
        if (response.data.results[0].voucher_id) {
          const voucherId = response.data.results[0].voucher_id
          const url2 = `/api/creditvoucherslist/${voucherId}`
          axios.get(url2).then(function(response) {

            dispatch({type: 'SET_PRINT_CASH_ADVANCE_VOUCHER', payload: response.data})
            dispatch({type: 'FETCHING_DONE', payload: ''})
            dispatch({type: 'SHOW_PRINT_CASH_ADVANCE_PANEL', payload: ''})

          }).catch(function(error) { // ON ERROR FETCHING VOUCHER CLEAN ALL
            dispatch({type: 'CLEAR_PRINT_CASH_ADVANCE_ADVANCE', payload: ''})
            dispatch({type: 'CLEAR_PRINT_CASH_ADVANCE_VOUCHER', payload: ''})
            dispatch({type: 'FETCHING_DONE', payload: ''})
            alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
            administrador del sistema con el siguiete error: ${error}`)
          })
        // IF THERE IS NO VOUCHER ID
        } else {
          dispatch({type: 'FETCHING_DONE', payload: ''})
          dispatch({type: 'SHOW_PRINT_CASH_ADVANCE_PANEL', payload: ''})
        }
      // IF THERE ARE NOT ADVANCES RESULTS
      } else {
        dispatch({type: 'CLEAR_PRINT_CASH_ADVANCE_ADVANCE', payload: ''})
        dispatch({type: 'CLEAR_PRINT_CASH_ADVANCE_VOUCHER', payload: ''})
        dispatch({type: 'FETCHING_DONE', payload: ''})
        alertify.alert('Error', `No se encontraron ventas con el valor de consecutivo: ${consecutive}`)
      }

    }).catch(function(error) { // ON ERROR FETCHING ADVANCE CLEAN ALL
      dispatch({type: 'CLEAR_PRINT_CASH_ADVANCE_ADVANCE', payload: ''})
      dispatch({type: 'CLEAR_PRINT_CASH_ADVANCE_VOUCHER', payload: ''})
      dispatch({type: 'FETCHING_DONE', payload: ''})
      alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
      administrador del sistema con el siguiete error: ${error}`)
    })
  }
}

export function loadCashAdvanceToPrintId(cashAdvanceId) {
  const url = `/api/cashadvances/${cashAdvanceId}`

  return function(dispatch) {
    // GET THE ADVANCE AND DISPATCH
    axios.get(url).then(function(response) {
      // FIRST CLEAR REDUCER DATA
      dispatch({type: 'CLEAR_PRINT_CASH_ADVANCE_ADVANCE', payload: ''})
      dispatch({type: 'CLEAR_PRINT_CASH_ADVANCE_VOUCHER', payload: ''})

      if (response.data) {
        // IF THERE IS MORE THAN ONE ELEMENT FILTERE
        dispatch({type: 'SET_PRINT_CASH_ADVANCE_ADVANCE', payload: response.data})
        // THEN IF THERE IS A VOUCHER, FETCH IT AND DISPATCH
        if (response.data.voucher_id) {
          const voucherId = response.data.voucher_id
          const url2 = `/api/creditvoucherslist/${voucherId}`
          axios.get(url2).then(function(response) {

            dispatch({type: 'SET_PRINT_CASH_ADVANCE_VOUCHER', payload: response.data})
            dispatch({type: 'FETCHING_DONE', payload: ''})
            dispatch({type: 'SHOW_PRINT_CASH_ADVANCE_PANEL', payload: ''})

          }).catch(function(error) { // ON ERROR FETCHING VOUCHER CLEAN ALL
            dispatch({type: 'CLEAR_PRINT_CASH_ADVANCE_ADVANCE', payload: ''})
            dispatch({type: 'CLEAR_PRINT_CASH_ADVANCE_VOUCHER', payload: ''})
            dispatch({type: 'FETCHING_DONE', payload: ''})
            alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
            administrador del sistema con el siguiete error: ${error}`)
          })
        // IF THERE IS NO VOUCHER ID
        } else {
          dispatch({type: 'FETCHING_DONE', payload: ''})
          dispatch({type: 'SHOW_PRINT_CASH_ADVANCE_PANEL', payload: ''})
        }
      // IF THERE ARE NOT ADVANCES RESULTS
      } else {
        dispatch({type: 'CLEAR_PRINT_CASH_ADVANCE_ADVANCE', payload: ''})
        dispatch({type: 'CLEAR_PRINT_CASH_ADVANCE_VOUCHER', payload: ''})
        dispatch({type: 'FETCHING_DONE', payload: ''})
        alertify.alert('Error', `No se encontraron ventas con el valor de consecutivo: ${consecutive}`)
      }

    }).catch(function(error) { // ON ERROR FETCHING ADVANCE CLEAN ALL
      dispatch({type: 'CLEAR_PRINT_CASH_ADVANCE_ADVANCE', payload: ''})
      dispatch({type: 'CLEAR_PRINT_CASH_ADVANCE_VOUCHER', payload: ''})
      dispatch({type: 'FETCHING_DONE', payload: ''})
      alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
      administrador del sistema con el siguiete error: ${error}`)
    })
  }
}
