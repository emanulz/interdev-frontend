// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
import axios from 'axios'

// ------------------------------------------------------------------------------------------
// CONFIG DEFAULT AXIOS
// ------------------------------------------------------------------------------------------

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

// ------------------------------------------------------------------------------------------
// SAVE FUNCTION (CREATE)
// ------------------------------------------------------------------------------------------
export function savePhysicalTake(kwargs, resolve, reject) {
  const data = {
    warehouse_id: kwargs.warehouseId,
    description: kwargs.description,
    is_full: kwargs.isFull
  }
  axios({
    method: 'post',
    url: '/api/physicaltakes/',
    data: data
  })
    .then((response) => {
      resolve(response.data)
    }).catch((err) => {
      console.log(err)
      if (err.response) {
        reject(err.response.data)
      }
      reject(err)
    })

}
