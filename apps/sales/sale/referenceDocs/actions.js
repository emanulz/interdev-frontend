// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

// ------------------------------------------------------------------------------------------
// GET PRESALES CLOSED, NOT NULL AND NOT BILLED
// ------------------------------------------------------------------------------------------
export function checkReferenceDocData(data) {

  if (data.documentNumber.length == 0) {
    alertify.alert('ERROR', 'Debe ingresar un número de documento válido para agregarlo a la factura.')
    return false
  }

  if (data.documentNumber.length > 50) {
    alertify.alert('ERROR', 'El número de documento puede tener 50 carácteres como máximo')
    return false
  }

  if (data.documentNotes.length > 180) {
    alertify.alert('ERROR', 'La rázon puede tener como máximo 180 carácteres.')
    return false
  }
  // IF ALL IS OK
  return true

}
