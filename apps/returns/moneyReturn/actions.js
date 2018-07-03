// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'
import axios from 'axios'

export function setSale(kwargs) {

  const lookUpValue = kwargs.lookUpValue
  const lookUpField = kwargs.lookUpField
  const history = kwargs.history
  const redirectUrl = kwargs.redirectUrl
  const url = kwargs.url

  return function(dispatch) {

    axios.get(`${url}?${lookUpField}=${lookUpValue}`).then(function(response) {

      if (response.data.count > 0) {
        // IF THERE IS MORE THAN ONE ELEMENT FILTERED
        if (response.data.count > 1) {
          alertify.alert('ATENCIÓN', `Existe mas de un ${kwargs.modelName} con el ${kwargs.lookUpName}:
          ${kwargs.lookUpValue}, se utilizará el primero en lista, por lo que puede no ser el mismo que ud desea
          actualizar, esto puede deberse a un error, por favor revise los
          datos o contacte con el administrador del sistema.`)
        }

        const client = response.data.results[0].client
        dispatch({type: kwargs.dispatchType, payload: response.data.results[0]})
        dispatch({type: 'CLIENT_SELECTED', payload: JSON.parse(client)})
        if (kwargs.dispatchType2 !== undefined && kwargs.dispatchType2 !== '') {
          dispatch({type: kwargs.dispatchType2, payload: response.data.results[0]})
        }
        dispatch({type: 'FETCHING_DONE', payload: ''})

      } else {
        dispatch({type: kwargs.dispatchErrorType, payload: ''})
        alertify.alert('Error', `No hay ${kwargs.modelName} con el valor de ${kwargs.lookUpName}: ${kwargs.lookUpValue}`,
          function() { history.push(redirectUrl) })
      }

    }).catch(function(error) {
      alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
      administrador del sistema con el siguiete error: ${error}`)
    })
  }

}
