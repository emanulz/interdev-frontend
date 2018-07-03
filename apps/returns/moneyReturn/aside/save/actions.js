// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------

import axios from 'axios'
// import { saveLog } from '../../../../utils/api'

// ------------------------------------------------------------------------------------------
// SAVE FUNCTION (CREATE)
// ------------------------------------------------------------------------------------------
export function saveItem(kwargs, resolve, reject) {
  const item = kwargs.item
  const url = kwargs.url

  return function(dispatch) {
    axios({
      method: 'post',
      url: url,
      data: item
    })
      .then((response) => {
        resolve(response.data)

      }).catch((err) => {
        console.log(err)
        reject(err)
      })

  }
}
