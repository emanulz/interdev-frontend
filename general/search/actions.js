// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'
import axios from 'axios'

export function searchItem(text, model, namespace) {
  if (!text.length) {
    alertify.alert('ERROR', `Debe digitar una búsqueda válida.`)
    return function(dispatch) {
      dispatch({type: 'FETCHING_DONE', payload: ''})
      dispatch({type: `${namespace}_CLEAR_SEARCH_RESULTS`, payload: ''})
    }
  }
  const newstr = text.replace('%', '&', 'gi').replace('+', '!', 'gi').replace('*', '$', 'gi')
  const data = {
    model: model,
    max_results: 20,
    search_key: newstr
  }
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
