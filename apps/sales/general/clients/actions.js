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
  const url = kwargs.url

  axios.get(`${url}/${kwargs.id}`).then(function(response) {

    if (response.data) {
      resolve(response.data)
    } else {
      alertify.alert('Error', `No Se pudo obtener el cliente por ID.`)
      reject()
    }
  }).catch(function(error) {
    alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
    administrador del sistema con el siguiete error: ${error}`)
    reject()
  })
}

export function getClient(kwargs, resolve, reject) {
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
      console.log(response.data.results)
      resolve(response.data.results[0])

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

export function getFullClientByCode(code, dispatch) {
  const getClientPromise = new Promise((resolve, reject) => {
    const kwargs = {
      lookUpField: 'code',
      url: '/api/clients/',
      lookUpValue: code,
      lookUpName: 'código',
      modelName: 'Clientes'
    }
    dispatch({type: 'FETCHING_STARTED', payload: ''})
    getClient(kwargs, resolve, reject)
  })

  getClientPromise.then((data) => {
    const client = data
    // WHEN COMPLETED SET IT BY ID
    const setClientPromise = new Promise((resolve, reject) => {
      const kwargs = {
        id: client.id,
        url: '/api/clients'
      }
      setClient(kwargs, resolve, reject)
    })
    setClientPromise.then((data) => {
      dispatch({type: 'FETCHING_DONE', payload: ''})
      const client = data
      console.log('CATEGORY', client.category)
      client.category = client.category.length ? JSON.parse(client.category) : {}
      dispatch({type: 'CLIENT_SELECTED', payload: client})
      // ON LOAD DISPATCH OR CLEAN THE CLIENT TO UPDATE
      try {
        if (client.client.code != '00') {
          dispatch({type: 'SET_UPDATE_CLIENT', payload: client.client})
          dispatch({type: 'SET_IS_INVOICE_VALUE', payload: 'FACTURA'})

        } else {
          dispatch({type: 'CLEAR_UPDATE_CLIENT', payload: ''})
          dispatch({type: 'SET_IS_INVOICE_VALUE', payload: 'TIQUETE'})
          window.sessionStorage.setItem('generalClient', JSON.stringify(client))
        }
      } catch (err) {}
    }).catch((err) => {
      dispatch({type: 'FETCHING_DONE', payload: ''})
      dispatch({type: 'CLIENT_NOT_FOUND', payload: -1})
      console.log(err)
    })

  }).catch((err) => {
    dispatch({type: 'FETCHING_DONE', payload: ''})
    dispatch({type: 'CLIENT_NOT_FOUND', payload: -1})
    console.log(err)
  })

}

export function getFullClientById(id, dispatch) {
  const setClientPromise = new Promise((resolve, reject) => {
    const kwargs = {
      id: id,
      url: '/api/clients'
    }
    setClient(kwargs, resolve, reject)
  })
  setClientPromise.then((data) => {
    dispatch({type: 'FETCHING_DONE', payload: ''})
    const client = data
    console.log('CATEGORY', client.category)
    client.category = client.category.length ? JSON.parse(client.category) : {}
    dispatch({type: 'CLIENT_SELECTED', payload: client})
    // ON LOAD DISPATCH OR CLEAN THE CLIENT TO UPDATE
    try {
      if (client.client.code != '00') {
        dispatch({type: 'SET_UPDATE_CLIENT', payload: client.client})
        dispatch({type: 'SET_IS_INVOICE_VALUE', payload: 'FACTURA'})
      } else {
        dispatch({type: 'CLEAR_UPDATE_CLIENT', payload: ''})
        dispatch({type: 'SET_IS_INVOICE_VALUE', payload: 'TIQUETE'})
      }
    } catch (err) {}
  }).catch((err) => {
    dispatch({type: 'FETCHING_DONE', payload: ''})
    dispatch({type: 'CLIENT_NOT_FOUND', payload: -1})
    console.log(err)
  })
}

export function determinClientName(client, extraClient) {
  if (client.client) { client = client.client }
  if (client) {
    if (client.code == '00') {
      return extraClient.name
    }
    return client.name
  }
  return 'Cliente'
}

export function determinClientLastName(client, extraClient) {
  if (client.client) { client = client.client }
  if (client) {
    if (client.code == '00') {
      return extraClient.last_name
    }
    return client.last_name
  }
  return 'General'
}

export function determinClientEmail(client, extraClient) {
  if (client.client) { client = client.client }
  if (client) {
    if (client.code == '00') {
      return extraClient.email
    }
    return client.email ? client.email : 'Sin Correo Registrado'
  }
  return 'Sin Correo Registrado'
}