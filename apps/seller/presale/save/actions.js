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

        saveLog(logCode, logModel, itemOld, item, logDescription, user)

        dispatch({type: 'CLEAR_PRESALE', payload: ''})
        dispatch({type: 'SET_PRESALE', payload: response.data})
        alertify.alert('Completado', kwargs.sucessMessage)
        resolve()

      }).catch((err) => {
        console.log(err)
        reject()
        if (err.response) {
          console.log(err.response.data)
        }
        alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err}.`)
      })

  }
}
