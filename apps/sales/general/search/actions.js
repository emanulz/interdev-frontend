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

export function productSearchClick(index, dispatch) {
  dispatch({type: 'productSearch_SET_ACTIVE_INDEX', payload: index})
  document.getElementById('productSearch-input-field').focus()
}

export function productSearchActive(product, dispatch) {
  dispatch({type: 'productSearch_SET_ACTIVE_IMAGE', payload: {name: product.image_name, code: product.code}})
}

export function productSetAction(code, dispatch) {
  dispatch({type: 'productSearch_TOGGLE_SEARCH_PANEL', payload: -1})
  document.getElementById('productCodeInputField').value = code
  document.getElementById('productCodeInputField').focus()
}

export function clientSearchDoubleClick(item, dispatch) {
  axios.get(`/api/clients/${item}`).then(function(response) {
    dispatch({type: 'CLIENT_SELECTED', payload: response.data})
    dispatch({type: 'clientSearch_TOGGLE_SEARCH_PANEL', payload: -1})
    const client = response.data
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
  }).catch(function(error) {
    alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
    administrador del sistema con el siguiete error: ${error}`)
  })
}
