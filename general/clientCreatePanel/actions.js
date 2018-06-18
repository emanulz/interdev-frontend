// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------

import axios from 'axios'

// ------------------------------------------------------------------------------------------
// SAVE FUNCTION
// ------------------------------------------------------------------------------------------
export function saveClient(kwargs, resolve, reject) {
  const item = kwargs.item
  delete item['id']
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
