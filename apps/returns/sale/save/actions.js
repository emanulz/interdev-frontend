// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

import axios from 'axios'
// import { saveLog } from '../../../../utils/api'

// ------------------------------------------------------------------------------------------
// SAVE FUNCTION (CREATE)
// ------------------------------------------------------------------------------------------
export function saveItem(kwargs, resolve, reject) {
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
        dispatch({type: 'CLEAR_SALE', payload: ''})
        dispatch({type: 'SET_SALE', payload: response.data})
        alertify.alert('Completado', kwargs.sucessMessage)
        resolve()

      }).catch((err) => {
        console.log(err)
        reject(err)
        // if (err.response) {
        //   console.log(err.response.data)
        // }
        // alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err}.`)
      })

  }
}

// function saveCreditMovement(movement, sale, kwargs, dispatch, resolve, reject) {
//   axios({
//     method: 'post',
//     url: '/api/creditmovements/',
//     data: movement
//   })
//     .then((response) => {
//       dispatch({type: 'CLEAR_SALE', payload: ''})
//       dispatch({type: 'SET_SALE', payload: sale})
//       alertify.alert('Completado', kwargs.sucessMessage)
//       resolve()
//     })
//     .catch(err => {
//       console.log(err.response.data)
//       alertify.alert('Error', `${kwargs.errorMessage} ERROR: ${err}.`)
//       reject()
//     })
// }
