// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

import axios from 'axios'
import { saveLog } from '../../../../utils/api'

// ------------------------------------------------------------------------------------------
// SAVE FUNCTION (CREATE)
// ------------------------------------------------------------------------------------------
export function saveItem(kwargs, resolve, reject) {
  const item = kwargs.item
  delete item['id']
  const url = kwargs.url
  const logCode = kwargs.logCode
  const itemOld = kwargs.itemOld
  const logModel = kwargs.logModel
  const logDescription = kwargs.logDescription
  const user = kwargs.user

  return function(dispatch) {

    axios({
      method: 'post',
      url: url,
      data: item
    })
      .then((response) => {
        console.log(response)
        dispatch({type: 'CLEAR_PRESALE', payload: ''})
        dispatch({type: 'SET_PRESALE', payload: response.data})
        resolve(response.data)
      }).catch((err) => {
        console.log(err.response.data)
        if (err.response) {
          console.log(err.response.data)
          alertify.alert('Error', `Error al procesar la Preventa, ERROR: ${err.response.data.friendly_errors}, ERROR DE SISTEMA: ${err.response.data.system_errors}`)
        } else {
          console.log('NO CUSTOM ERROR')
          console.log(err)
          alertify.alert('Error', `Error al procesar la Preventa, ERROR: ${err}.`)
        }
        reject()
      })

  }
}
