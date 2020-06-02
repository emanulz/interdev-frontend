import alertify from 'alertifyjs'
import axios from 'axios'

export function loadClientToShow(code) {
  const url = `/api/clients/?code=${code}`

  return function(dispatch) {
    // GET THE SALE AND DISPATCH
    axios.get(url).then(function(response) {
      // FIRST CLEAR REDUCER DATA
      dispatch({type: 'CLEAR_PRINT_PRESALE', payload: ''})

      if (response.data.count > 0) {
        // IF THERE IS MORE THAN ONE ELEMENT FILTERED
        if (response.data.count > 1) {
          alertify.alert('ATENCIÓN', `Existe mas de un cliente con el código:
          ${code}, se utilizará el primero en lista, por lo que puede no ser la mismo que ud desea
          consultar, esto puede deberse a un error, por favor revise los
          datos o contacte con el administrador del sistema.`)
        }

        dispatch({type: 'SET_CLIENT', payload: response.data.results[0]})
        // THEN IF THERE IS A PRESALE, FETCH IT AND DISPATCH
        dispatch({type: 'FETCHING_DONE', payload: ''})
        const element = document.getElementById('clientCard')
        element.classList.add('visible')

      // IF THERE ARE NOT SALES RESULTS
      } else {
        dispatch({type: 'CLEAR_CLIENT', payload: ''})
        dispatch({type: 'FETCHING_DONE', payload: ''})
        const element = document.getElementById('clientCard')
        element.classList.remove('visible')
        alertify.alert('Error', `No se encontraron clientes con el valor de código: ${code}`)
      }

    }).catch(function(error) { // ON ERROR FETCHING SALE CLEAN ALL
      dispatch({type: 'CLEAR_CLIENT', payload: ''})
      dispatch({type: 'FETCHING_DONE', payload: ''})
      const element = document.getElementById('clientCard')
      element.classList.remove('visible')
      alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
      administrador del sistema con el siguiete error: ${error}`)
    })
  }
}
