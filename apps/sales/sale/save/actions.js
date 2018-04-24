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

        // IF THE SALE IS A CREDIT ONE SAVE CREDIT MOVEMENT
        if (response.data.pay_type == 'CRED') {
          const creditMovement = kwargs.creditMovement
          creditMovement.bill_id = response.data.id
          creditMovement.description = `Venta de crédito #${response.data.bill_number}`
          saveCreditMovement(creditMovement, response.data, kwargs, dispatch, resolve, reject)

        // IF IS CASH THEN JUST RESOLVE
        } else {
          dispatch({type: 'CLEAR_SALE', payload: ''})
          dispatch({type: 'SET_SALE', payload: response.data})
          alertify.alert('Completado', kwargs.sucessMessage)
          resolve()
        }

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

function saveCreditMovement(movement, sale, kwargs, dispatch, resolve, reject) {
  axios({
    method: 'post',
    url: '/api/creditmovements/',
    data: movement
  })
    .then((response) => {
      dispatch({type: 'CLEAR_SALE', payload: ''})
      dispatch({type: 'SET_SALE', payload: sale})
      alertify.alert('Completado', kwargs.sucessMessage)
      resolve()
    })
    .catch(err => {
      console.log(err.response.data)
      alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err}.`)
      reject()
    })
}
