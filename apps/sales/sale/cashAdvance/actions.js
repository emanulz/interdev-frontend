// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'
import axios from 'axios'

// ------------------------------------------------------------------------------------------
// GET PRESALES CLOSED, NOT NULL AND NOT BILLED
// ------------------------------------------------------------------------------------------
export function checkAdvanceData(data) {
  if (data.description.length == 0) {
    alertify.alert('ERROR', 'Debe ingresar una descripción.')
    return false
  }
  if (data.amount.length == 0 || data.amount <= 0) {
    alertify.alert('ERROR', 'Debe ingresar un monto válido.')
    return false
  }
  if (data.client_id.length == 0) {
    alertify.alert('ERROR', 'Debe seleccionar un cliente válido.')
    return false
  }
  // IF ALL IS OK
  return true

}

export function createAdvance(kwargs, resolve, reject) {

  axios({
    method: 'post',
    url: '/api/cashadvances/',
    data: kwargs
  })
    .then((response) => {
      resolve(response.data)
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
}
