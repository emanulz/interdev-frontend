// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'
import axios from 'axios'

export function searchItem(text, model, namespace) {
  const data = {
    model: model,
    max_results: 50,
    search_key: text
  }
  return function(dispatch) {
    console.log(data)
    axios({
      method: 'post',
      url: 'http://192.168.9.107/api/search/search/',
      data: data
    })
      .then((response) => {
        console.log(response)
        dispatch({type: `${namespace}_SET_SEARCH_RESULTS`, payload: response.data})
        dispatch({type: 'FETCHING_DONE', payload: ''})

      }).catch((err) => {
        alertify.alert('ERROR', `Ocurrió un error en la búsqueda, Error: ${err}`)
        console.log(err)
        if (err.response) {
          console.log(err.response.data)
        }
      })

  }
}
