// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------

import axios from 'axios'

// ------------------------------------------------------------------------------------------
// SAVE FUNCTION
// ------------------------------------------------------------------------------------------
export function updateClient(kwargs, resolve, reject) {
  const item = kwargs.item
  const url = kwargs.url

  return function(dispatch) {

    axios({
      method: 'patch',
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
