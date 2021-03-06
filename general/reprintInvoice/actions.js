// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'
import axios from 'axios'
const Mousetrap = require('mousetrap')

export function OldloadSaleToReprint(consecutive) {
  const url = `/api/saleslist?consecutive=${consecutive}`

  return function(dispatch) {
    // GET THE SALE AND DISPATCH
    axios.get(url).then(function(response) {
      // FIRST CLEAR REDUCER DATA
      dispatch({type: 'CLEAR_REPRINT_INVOICE_SALE', payload: ''})
      dispatch({type: 'CLEAR_REPRINT_INVOICE_PRESALE', payload: ''})

      if (response.data.count > 0) {
        // IF THERE IS MORE THAN ONE ELEMENT FILTERED
        if (response.data.count > 1) {
          alertify.alert('ATENCIÓN', `Existe mas de una venta con el consecutivo:
          ${consecutive}, se utilizará la primera en lista, por lo que puede no ser la mismo que ud desea
          consultar, esto puede deberse a un error, por favor revise los
          datos o contacte con el administrador del sistema.`)
        }

        dispatch({type: 'SET_REPRINT_INVOICE_SALE', payload: response.data.results[0]})
        // THEN IF THERE IS A PRESALE, FETCH IT AND DISPATCH
        if (response.data.results[0].presale_id) {
          const presaleId = response.data.results[0].presale_id
          const url2 = `/api/presales/${presaleId}`
          axios.get(url2).then(function(response) {

            dispatch({type: 'SET_REPRINT_INVOICE_PRESALE', payload: response.data})
            dispatch({type: 'FETCHING_DONE', payload: ''})
            dispatch({type: 'SHOW_REPRINT_INVOICE_PANEL', payload: ''})

          }).catch(function(error) { // ON ERROR FETCHING PRESALE CLEAN ALL
            dispatch({type: 'CLEAR_REPRINT_INVOICE_SALE', payload: ''})
            dispatch({type: 'CLEAR_REPRINT_INVOICE_PRESALE', payload: ''})
            dispatch({type: 'FETCHING_DONE', payload: ''})
            alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
            administrador del sistema con el siguiete error: ${error}`)
          })
        // IF THERE IS NO PRESALE ID
        } else {
          dispatch({type: 'FETCHING_DONE', payload: ''})
          dispatch({type: 'SHOW_REPRINT_INVOICE_PANEL', payload: ''})
        }
      // IF THERE ARE NOT SALES RESULTS
      } else {
        dispatch({type: 'CLEAR_REPRINT_INVOICE_SALE', payload: ''})
        dispatch({type: 'CLEAR_REPRINT_INVOICE_PRESALE', payload: ''})
        dispatch({type: 'FETCHING_DONE', payload: ''})
        alertify.alert('Error', `No se encontraron ventas con el valor de consecutivo: ${consecutive}`)
      }

    }).catch(function(error) { // ON ERROR FETCHING SALE CLEAN ALL
      dispatch({type: 'CLEAR_REPRINT_INVOICE_SALE', payload: ''})
      dispatch({type: 'CLEAR_REPRINT_INVOICE_PRESALE', payload: ''})
      dispatch({type: 'FETCHING_DONE', payload: ''})
      alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
      administrador del sistema con el siguiete error: ${error}`)
    })
  }
}

export function loadSaleToReprint(consecutive, bind, reload) {
  const url = `/api/saleslist/getsaledata/?consecutive=${consecutive}`

  return function(dispatch) {
    // GET THE SALE AND DISPATCH
    axios.get(url).then(function(response) {
      console.log(response)
      // FIRST CLEAR REDUCER DATA
      dispatch({type: 'CLEAR_REPRINT_INVOICE_SALE', payload: ''})
      dispatch({type: 'CLEAR_REPRINT_INVOICE_PRESALE', payload: ''})
      dispatch({type: 'CLEAR_REPRINT_INVOICE_TICKET', payload: ''})
      dispatch({type: 'CLEAR_REPRINT_INVOICE_INVOICE', payload: ''})
      dispatch({type: 'CLEAR_REPRINT_INVOICE_CREDIT_NOTES', payload: ''})
      dispatch({type: 'CLEAR_REPRINT_INVOICE_DEBIT_NOTES', payload: ''})

      dispatch({type: 'SET_REPRINT_INVOICE_SALE', payload: response.data.sale})
      dispatch({type: 'SET_CURRENCY', payload: response.data.sale.currency_code})
      dispatch({type: 'SET_REPRINT_INVOICE_TICKET', payload: response.data.ticket})
      dispatch({type: 'SET_REPRINT_INVOICE_INVOICE', payload: response.data.invoice})
      dispatch({type: 'SET_REPRINT_INVOICE_CREDIT_NOTES', payload: response.data.credit_notes})
      dispatch({type: 'SET_REPRINT_INVOICE_CREDIT_DEBIT', payload: response.data.debit_notes})
      // THEN IF THERE IS A PRESALE, FETCH IT AND DISPATCH
      if (response.data.sale.presale_id) {
        const presaleId = response.data.sale.presale_id
        const url2 = `/api/presales/${presaleId}`
        axios.get(url2).then(function(response) {

          dispatch({type: 'SET_REPRINT_INVOICE_PRESALE', payload: response.data})
          dispatch({type: 'FETCHING_DONE', payload: ''})
          dispatch({type: 'SHOW_REPRINT_INVOICE_PANEL', payload: ''})

        }).catch(function(error) { // ON ERROR FETCHING PRESALE CLEAN ALL
          dispatch({type: 'CLEAR_REPRINT_INVOICE_SALE', payload: ''})
          dispatch({type: 'CLEAR_REPRINT_INVOICE_PRESALE', payload: ''})
          dispatch({type: 'FETCHING_DONE', payload: ''})
          alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
          administrador del sistema con el siguiete error: ${error}`)
        })
      // IF THERE IS NO PRESALE ID
      } else {
        dispatch({type: 'FETCHING_DONE', payload: ''})
        dispatch({type: 'SHOW_REPRINT_INVOICE_PANEL', payload: ''})
      }
      if (bind) {
        Mousetrap.bind('enter', function() {
          Mousetrap.unbind('enter')
          window.printDiv('reprint-invoice-print', ['/static/fixedBundles/css/sales.css'])
          if (reload) {
            window.location.href = '/sales'
          }
        })
      }

    }).catch(function(error) { // ON ERROR FETCHING SALE CLEAN ALL
      dispatch({type: 'CLEAR_REPRINT_INVOICE_SALE', payload: ''})
      dispatch({type: 'CLEAR_REPRINT_INVOICE_PRESALE', payload: ''})
      dispatch({type: 'CLEAR_REPRINT_INVOICE_TICKET', payload: ''})
      dispatch({type: 'CLEAR_REPRINT_INVOICE_INVOICE', payload: ''})
      dispatch({type: 'CLEAR_REPRINT_INVOICE_CREDIT_NOTES', payload: ''})
      dispatch({type: 'CLEAR_REPRINT_INVOICE_DEBIT_NOTES', payload: ''})
      dispatch({type: 'FETCHING_DONE', payload: ''})
      console.log(error)
      alertify.alert('Error', `No se encontraron ventas con el valor de consecutivo interno: ${consecutive}`)
      // alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
      // administrador del sistema con el siguiete error: ${error}`)
    })
  }
}
