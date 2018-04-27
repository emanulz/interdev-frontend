// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

export function checkClientData(sender, senders) {
  let Ok = true

  if (sender.code == '') {
    alertify.alert('Error', 'Debe especificar el código del Cliente')
    return false
  }

  if (sender.name == '') {
    alertify.alert('Error', 'Debe especificar el nombre del Cliente')
    return false
  }

  if (sender.max_discount > 100 || sender.max_discount < 0) {
    alertify.alert('Error', 'El descuento Máximo debe estar entre 0% y 100%')
    return false
  }

  if (sender.pred_discount > 100 || sender.pred_discount < 0) {
    alertify.alert('Error', 'El descuento Predeterminado debe estar entre 0% y 100%')
    return false
  }

  if (sender.pred_discount > sender.max_discount) {
    alertify.alert('Error', 'El descuento Predeterminado no puede ser mayor al descuento Máximo')
    return false
  }

  // UNIQUE FIELDS
  senders.forEach((senderData) => {
    if (sender.code == senderData.code) {
      if (sender.id != senderData.id) {
        alertify.alert('Error', `El sendere ${senderData.name} ${senderData.last_name} ya posee el código ${senderData.code}`)
        Ok = false
        return false
      }
    }
    if (sender.id_num == senderData.id_num && senderData.id_num != '') {
      if (sender.id != senderData.id) {
        alertify.alert('Error', `El sendere ${senderData.name} ${senderData.last_name} ya posee la identificación ${senderData.id_num}`)
        Ok = false
        return false
      }
    }
  })

  return Ok
}
