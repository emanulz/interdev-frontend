// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
import axios from 'axios'
import alertify from 'alertifyjs'

// ------------------------------------------------------------------------------------------
// CONFIG DEFAULT AXIOS
// ------------------------------------------------------------------------------------------

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

export function applyPhysicalTake(kwargs) {
  axios.defaults.timeout = '600000'
  const data = {
    apply_full: kwargs.apply_full,
    deactivate_not_taken_non_existent: kwargs.deactivate_not_taken_non_existent
  }
  return function (dispatch) {
    axios({
      method: 'post',
      url: `/api/physicaltakes/${kwargs.id}/apply_physical_take/`,
      data: data
    })
      .then((response) => {
        console.log(response)
        axios.defaults.timeout = '0'
        dispatch({type: 'FETCHING_DONE', payload: ''})
        alertify.alert('COMPLETADO', 'Toma física aplicada y cerrada correctamente.')
      }).catch((err) => {
        console.log(err)
        if (err.response) {
          console.log(err.response)
          alertify.alert('ERROR', `Hubo un error al aplicar la toma física Error:${err.response}`)
          dispatch({type: 'FETCHING_DONE', payload: ''})
          axios.defaults.timeout = '0'
        } else {
          console.log(err)
          alertify.alert('ERROR', `Hubo un error al aplicar la toma física Error:${err}`)
          dispatch({type: 'FETCHING_DONE', payload: ''})
          axios.defaults.timeout = '0'
        }
      })
  }

}
