// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'
import axios from 'axios'

export function checkClientProduct(client_prod) {
  const Ok = true
  return Ok
}

export function checkClientData(client, clients) {
  let Ok = true

  if (client.name == '') {
    alertify.alert('Error', 'Debe especificar el nombre del Cliente')
    return false
  }

  if (client.max_discount > 100 || client.max_discount < 0) {
    alertify.alert('Error', 'El descuento Máximo debe estar entre 0% y 100%')
    return false
  }

  if (client.pred_discount > 100 || client.pred_discount < 0) {
    alertify.alert('Error', 'El descuento Predeterminado debe estar entre 0% y 100%')
    return false
  }

  if (client.pred_discount > client.max_discount) {
    alertify.alert('Error', 'El descuento Predeterminado no puede ser mayor al descuento Máximo')
    return false
  }

  return Ok
}

export function saveClientLocal(kwargs, resolve, reject) {

  const item = kwargs.item
  delete item['id']
  const url = kwargs.url
  return function(dispatch) {

    axios({
      method: 'post',
      url: url,
      data: item
    })
      .then((response) => {
        alertify.alert('Completado', kwargs.sucessMessage)
        dispatch({type: kwargs.dispatchType, payload: ''})
        dispatch({type: 'FETCHING_DONE', payload: ''})
        resolve()
      }).catch((err) => {
        if (err.response) {
          console.log(err.response.data)
          alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
        } else {
          console.log('NO CUSTOM ERROR')
          console.log(err)
          alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err}.`)
        }
        reject(err)
        dispatch({type: 'FETCHING_DONE', payload: ''})
      })

  }

}

export function updateClientLocal(kwargs, resolve, reject) {
  const item = kwargs.item
  const url = kwargs.url
  return function(dispatch) {

    axios({
      method: 'patch',
      url: url,
      data: item
    })
      .then((response) => {
        if (kwargs.sucessMessage) {
          alertify.alert('Completado', kwargs.sucessMessage)
        }
        dispatch({type: kwargs.dispatchType, payload: ''})
        dispatch({type: 'FETCHING_DONE', payload: ''})
        resolve()
      }).catch((err) => {
        if (err.response) {
          console.log(err.response.data)
          alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
        } else {
          console.log('NO CUSTOM ERROR')
          console.log(err)
          alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err}.`)
            .set('onok', function() {
              return true
            })
        }
        reject(err)
        dispatch({type: 'FETCHING_DONE', payload: ''})
      })
  }
}

export function deleteClientLocal(kwargs, resolve, reject) {

  const item = kwargs.item
  const url = kwargs.url
  return function(dispatch) {

    axios({
      method: 'delete',
      url: url,
      data: item
    })
      .then((response) => {
        alertify.alert('Completado', kwargs.sucessMessage)
        dispatch({type: kwargs.dispatchType})
        dispatch({type: 'FETCHING_DONE'})
        resolve()
      }).catch((err) => {
        if (err.response) {
          console.log(err.response.data)
          alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
        } else {
          console.log('NO CUSTOM ERROR')
          console.log(err)
          alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err}.`)
            .set('onok', function() {
              return true
            })
        }
        reject(err)
        dispatch({type: 'FETCHING_DONE', payload: ''})
      })
  }
}