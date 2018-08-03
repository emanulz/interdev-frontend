import alertify from 'alertifyjs'
import axios from 'axios'

export function productSearchDoubleClick(item, dispatch) {
  axios.get(`/api/products/${item}`).then(function(response) {
    dispatch({type: 'SET_SINGLE_PRODUCT_ACTIVE', payload: response.data})
    dispatch({type: 'TOGGLE_SINGLE_PRODUCT_PANEL', payload: response.data})
  }).catch(function(error) {
    alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
    administrador del sistema con el siguiete error: ${error}`)
  })
}

export function clientSearchDoubleClick(item, dispatch) {
  axios.get(`/api/clients/${item}`).then(function(response) {
    dispatch({type: 'CLIENT_SELECTED', payload: response.data})
    dispatch({type: 'clientSearch_TOGGLE_SEARCH_PANEL', payload: -1})
  }).catch(function(error) {
    alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
    administrador del sistema con el siguiete error: ${error}`)
  })
}
