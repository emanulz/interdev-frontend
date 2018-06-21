// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

import axios from 'axios'

// ------------------------------------------------------------------------------------------
// CONFIG DEFAULT AXIOS
// ------------------------------------------------------------------------------------------

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
// export function clientSelected(code, clients) {

//   const clientSelected = clients.findIndex(client => client.code == code) // checks if client exists

//   const res = (clientSelected == -1) // if not exists dispatch Not Found
//     ? {
//       type: 'CLIENT_NOT_FOUND',
//       payload: -1
//     }
//     : {
//       type: 'CLIENT_SELECTED',
//       payload: {
//         client: clients[clientSelected]
//       }
//     }

//   return res

// }

export function clientSearchDoubleClick(item, dispatch){
  axios.get(`/api/clients/${item}`).then(function(response) {
      dispatch({type: 'CLIENT_SELECTED', payload: response.data.client})
      dispatch({type: 'clientSearch_TOGGLE_SEARCH_PANEL', payload: response.data})
  }).catch(function(error) {
      alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
      administrador del sistema con el siguiete error: ${error}`)
  })

}

export function searchClient(search_key, model, namespace){

  const data = {
    model: model,
    max_results: 15,
    search_key: `!${search_key}`
  }

  return function(dispatch){
    axios({
      method: 'post',
      url: '/api/search/search/',
      data: data
    }).then(response=>{
      if(response.data.length == 1){
        dispatch({type: 'CLIENT_SELECTED', payload:response.data[0]})
        dispatch({type: 'FETCHING_DONE'})
      }else if(response.data.length>1){
        dispatch({type: `${namespace}_SET_SEARCH_RESULTS`, payload:response.data})
        dispatch({type: `${namespace}_TOGGLE_SEARCH_PANEL`})
        dispatch({type: 'FETCHING_DONE'})
      }

    }).catch(err=>{
      alertify.alert('ERROR', `Ocurrió un error en la búsqueda, Error: ${err}`)
      console.log(err)
      if (err.response) {
        console.log(err.response.data)
      }
      dispatch({type: 'FETCHING_DONE', payload: ''})
    })
  }

}

// export function userSelected(_id, users) {

//   const userSelected = users.findIndex(user => user._id == _id) // checks if user exists

//   const res = (userSelected == -1) // if not exists dispatch Not Found
//     ? {
//       type: 'USER_NOT_FOUND',
//       payload: -1
//     }
//     : {
//       type: 'USER_SELECTED',
//       payload: {
//         user: users[userSelected]
//       }
//     }

//   return res

// }
