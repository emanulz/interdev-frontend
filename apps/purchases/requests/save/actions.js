// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

import axios from 'axios'

// ------------------------------------------------------------------------------------------
// SAVE FUNCTION (CREATE)
// ------------------------------------------------------------------------------------------
export function saveItem(kwargs, resolve, reject) {
  const item = kwargs.item
  delete item['id']
  const url = kwargs.url

  return function(dispatch) {
    console.log('REQUEST TO SAVE --->', item)
    axios({
      method: 'post',
      url: url,
      data: item
    })
      .then((response) => {
        console.log(response)
        resolve(response.data)
      }).catch((err) => {
        console.log(err.response.data)
        if (err.response) {
          console.log(err.response.data)
          alertify.alert('Error', `Error al procesar la Orden de Cotización, ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
        } else {
          console.log('NO CUSTOM ERROR')
          console.log(err)
          alertify.alert('Error', `Error al procesar la Orden de Cotización, ERROR: ${err}.`)
        }
        reject()
      })
  }
}
