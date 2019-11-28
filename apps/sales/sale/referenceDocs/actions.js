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
  // IF ALL IS OK
  return true

}
