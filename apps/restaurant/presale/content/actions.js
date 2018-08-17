// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import axios from 'axios'

// ------------------------------------------------------------------------------------------
// SAVE FUNCTION (CREATE)
// ------------------------------------------------------------------------------------------
export function updatePresale(kwargs, resolve, reject) {
  const item = kwargs.item
  delete item['id']
  const url = kwargs.url

  return function(dispatch) {

    axios({
      method: 'patch',
      url: url,
      data: item
    })
      .then((response) => {
        console.log(response)
        resolve(response.data)

      }).catch((err) => {
        console.log(err)
        if (err.response) {
          console.log(err.response.data)
        }
        reject()
      })

  }
}
