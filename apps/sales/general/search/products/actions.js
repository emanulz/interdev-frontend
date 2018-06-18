// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'
import axios from 'axios'

// ------------------------------------------------------------------------------------------
// CONFIG DEFAULT AXIOS
// ------------------------------------------------------------------------------------------

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

export function hidePanel() {

  return {type: 'PRODUCT_HIDE_PANEL', payload: -1}
}

export function searchProduct(val, products) {

  const text = val.split('%')
  const matchs = []

  products.forEach(product => {
    let control = true
    const description = product.description.toString()

    text.forEach(word => {
      const index = description.toLowerCase().indexOf(word.toLowerCase())

      if (index == -1) {
        control = false
        return false
      }
    })

    if (control) {
      matchs.push(product)
    }

  })

  const res = (matchs.length)
    ? {
      type: 'PRODUCT_SEARCH_SUCCESS',
      payload: matchs
    }
    : {
      type: 'PRODUCT_SEARCH_FAIL',
      payload: -1
    }

  return res
}

export function productSelectedTable(code) {

  return {type: 'SET_PRODUCT_FIELD_VALUE', payload: code}

}

export function searchProductBakend(kwargs) {
  const lookUpValue = kwargs.lookUpValue
  const lookUpField = kwargs.lookUpField
  const url = kwargs.url

  return function(dispatch) {
    axios.get(`${url}?${lookUpField}=${lookUpValue}&limit=20`).then(function(response) {
    // axios.get(`${url}?description=((timer|atlas)+.*(timer|atlas)+)&limit=20`).then(function(response) {
      console.log(response.data)
      if (response.data.count) {

        dispatch({type: 'PRODUCT_SEARCH_SUCCESS', payload: response.data.results})
        dispatch({type: 'FETCHING_DONE', payload: ''})

      } else {
        dispatch({type: 'PRODUCT_SEARCH_FAIL', payload: ''})
        dispatch({type: 'FETCHING_DONE', payload: ''})
        // alertify.alert('Error', `No hay ${kwargs.modelName} con el valor de ${kwargs.lookUpName}: ${kwargs.lookUpValue}`)
      }

    }).catch(function(error) {
      alertify.alert('ERROR', `Error al obtener el valor del API, por favor intente de nuevo o comuníquese con el
      administrador del sistema con el siguiete error: ${error}`)
    })
  }
}
