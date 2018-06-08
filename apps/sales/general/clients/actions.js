import alertify from 'alertifyjs'
import axios from 'axios'

export function clientSelected(code, clients) {

  const clientSelected = clients.findIndex(client => client.code == code) // checks if product exists

  const res = (clientSelected == -1) // if not exists dispatch Not Found, if exists check if already in cart
    ? {
      type: 'CLIENT_NOT_FOUND',
      payload: -1
    }
    : {
      type: 'CLIENT_SELECTED',
      payload: {
        client: clients[clientSelected]
      }
    }

  return res

}

export function userSelected(_id, users) {

  const userSelected = users.findIndex(user => user._id == _id) // checks if product exists

  const res = (userSelected == -1) // if not exists dispatch Not Found, if exists check if already in cart
    ? {
      type: 'USER_NOT_FOUND',
      payload: -1
    }
    : {
      type: 'USER_SELECTED',
      payload: {
        user: users[userSelected]
      }
    }

  return res

}

export function searchClient() {

  return {type: 'CLIENT_SHOW_PANEL', payload: -1}
}

export function setClient(kwargs, resolve, reject) {
  const lookUpValue = kwargs.lookUpValue
  const lookUpField = kwargs.lookUpField
  const url = kwargs.url

  axios.get(`${url}?${lookUpField}=${lookUpValue}`).then(function(response) {
    if (response.data.count) {
      // IF THERE IS MORE THAN ONE ELEMENT FILTERED
      if (response.data.count > 1) {
        alertify.alert('ATENCIÓN', `Existe mas de un ${kwargs.modelName} con el ${kwargs.lookUpName}:
        ${kwargs.lookUpValue}, se utilizará el primero en lista, por lo que puede no ser el mismo que ud desea
        actualizar, esto puede deberse a un error, por favor revise los
        datos o contacte con el administrador del sistema.`)
      }

      resolve(response.data)

    } else {
      alertify.alert('Error', `No hay ${kwargs.modelName} con el valor de ${kwargs.lookUpName}: ${kwargs.lookUpValue}`)
      reject()
    }

  }).catch(function(error) {
    alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
    administrador del sistema con el siguiete error: ${error}`)
    reject()
  })
}
