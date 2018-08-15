// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

export function checkClientData(client, clients) {
  let Ok = true

  if (client.name == '') {
    alertify.alert('Error', 'Debe especificar el nombre del Cliente')
    return false
  }

  if (client.max_discount > 100 || client.max_discount < 0) {
    alertify.alert('Error', 'El descuento Máximo debe estar entre 0% y 100%')
    return false
  }

  if (client.pred_discount > 100 || client.pred_discount < 0) {
    alertify.alert('Error', 'El descuento Predeterminado debe estar entre 0% y 100%')
    return false
  }

  if (client.pred_discount > client.max_discount) {
    alertify.alert('Error', 'El descuento Predeterminado no puede ser mayor al descuento Máximo')
    return false
  }

  // UNIQUE FIELDS
  clients.forEach((clientData) => {
    if (client.code == clientData.code) {
      if (client.id != clientData.id) {
        alertify.alert('Error', `El cliente ${clientData.name} ${clientData.last_name} ya posee el código ${clientData.code}`)
        Ok = false
        return false
      }
    }
    if (client.id_num == clientData.id_num && clientData.id_num != '') {
      if (client.id != clientData.id) {
        alertify.alert('Error', `El cliente ${clientData.name} ${clientData.last_name} ya posee la identificación ${clientData.id_num}`)
        Ok = false
        return false
      }
    }
  })

  return Ok
}
