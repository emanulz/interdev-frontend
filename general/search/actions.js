// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'
import axios from 'axios'

export function searchItem(text, model, namespace, clientId, presaleType, notDeleted) {
  if (!text.length) {
    alertify.alert('ERROR', `Debe digitar una búsqueda válida.`)
    return function(dispatch) {
      dispatch({type: 'FETCHING_DONE', payload: ''})
      dispatch({type: `${namespace}_CLEAR_SEARCH_RESULTS`, payload: ''})
    }
  }
  const presaleTypeInner = presaleType ? presaleType : ''
  let newstr = text.replace(/%/g, '&').replace('+', '!', 'gi').replace('*', '$', 'gi')
  // INTERCEPT STRING ONLY IF MODEL IS CLIENT
  if (model == 'client') {
    const newText = text.split('*')
    if (newText[0] && newText[1]) {
      newstr = `name=${newText[0]}&last_name=${newText[1]}`
    }
  }
  console.log('TEXT TO SEARCH----->', newstr)
  const data = {
    model: model,
    max_results: 100,
    search_key: newstr,
    clientId: clientId,
    presale_type: presaleTypeInner,
    not_deleted: notDeleted
  }
  // console.log('DATAAAA', data)
  return function(dispatch) {
    console.log(data)
    axios({
      method: 'post',
      url: '/api/search/search/',
      data: data
    })
      .then((response) => {
        if (!response.data.length) {
          alertify.alert('SIN RESULTADOS', `No se obtuvieron resultados de la búsqueda`)
        }
        dispatch({type: `${namespace}_SET_SEARCH_RESULTS`, payload: response.data})
        dispatch({type: 'FETCHING_DONE', payload: ''})

      }).catch((err) => {
        alertify.alert('ERROR', `Ocurrió un error en la búsqueda, Error: ${err}`)
        console.log(err)
        if (err.response) {
          console.log(err.response.data)
        }
        dispatch({type: 'FETCHING_DONE', payload: ''})
      })

  }
}

export function searchItemPaginated(text, model, namespace, clientId, presaleType, notDeleted, offset, pageSize) {
  if (!text.length) {
    alertify.alert('ERROR', `Debe digitar una búsqueda válida.`)
    return function(dispatch) {
      dispatch({type: 'FETCHING_DONE', payload: ''})
      dispatch({type: `${namespace}_CLEAR_SEARCH_RESULTS`, payload: ''})
    }
  }
  const presaleTypeInner = presaleType ? presaleType : ''
  let newstr = text.replace(/%/g, '&').replace('+', '!', 'gi').replace('*', '$', 'gi')
  // INTERCEPT STRING ONLY IF MODEL IS CLIENT
  if (model == 'client') {
    const newText = text.split('*')
    if (newText[0] && newText[1]) {
      newstr = `name=${newText[0]}&last_name=${newText[1]}`
    }
  }
  console.log('TEXT TO SEARCH----->', newstr)
  const data = {
    model: model,
    max_results: pageSize,
    search_key: newstr,
    clientId: clientId,
    presale_type: presaleTypeInner,
    not_deleted: notDeleted,
    offset: offset
  }
  console.log('DATAAAA', data)
  return function(dispatch) {
    console.log(data)
    axios({
      method: 'post',
      url: '/api/search/search_paginated/',
      data: data
    })
      .then((response) => {
        console.log('SEARCH RESULTS', response.data)
        if (!response.data.results.length) {
          alertify.alert('SIN RESULTADOS', `No se obtuvieron resultados de la búsqueda`)
        }
        dispatch({type: `${namespace}_SET_PAGINATED_SEARCH_RESULTS`, payload: response.data})
        dispatch({type: 'FETCHING_DONE', payload: ''})

      }).catch((err) => {
        alertify.alert('ERROR', `Ocurrió un error en la búsqueda, Error: ${err}`)
        console.log(err)
        if (err.response) {
          console.log(err.response.data)
        }
        dispatch({type: 'FETCHING_DONE', payload: ''})
      })

  }
}
