// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
import axios from 'axios'
import alertify from 'alertifyjs'

// ------------------------------------------------------------------------------------------
// CONFIG DEFAULT AXIOS
// ------------------------------------------------------------------------------------------

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

// ------------------------------------------------------------------------------------------
// SAVE FUNCTION (CREATE)
// ------------------------------------------------------------------------------------------
export function savePhysicalTakeMovements(kwargs, resolve, reject) {
  const data = {cart: kwargs.cart}
  axios({
    method: 'post',
    url: `/api/physicaltakes/${kwargs.takeId}/physical_take_movements/`,
    data: data
  })
    .then((response) => {
      resolve(response.data)
    }).catch((err) => {
      console.log(err.response.data)
      if (err.response) {
        reject(err.response.data)
      }
      reject(err)
    })
}

export function getOpenTakes() {
  return function (dispatch) {
    axios({
      method: 'get',
      url: `/api/physicaltakes/?is_closed=False&ordering=-consecutive`
    })
      .then((response) => {
        dispatch({type: 'FETCH_OPEN_TAKES_FULFILLED', payload: response.data.results})
        if (response.data.results.length == 1) {
          dispatch({type: 'SET_MOVEMENTS_TAKE_ID', payload: response.data.results[0].id})
        }
      }).catch((err) => {
        console.log(err)
        dispatch({type: 'FETCH_OPEN_TAKES_REJECTED', payload: ''})
      })
  }
}
