// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

// ------------------------------------------------------------------------------------------
// GET PRESALES CLOSED, NOT NULL AND NOT BILLED
// ------------------------------------------------------------------------------------------
export function checkExemptionData(data) {
  if (data.documentType.length == 0) {
    alertify.alert('ERROR', 'Debe ingresar un tipo de documento válido para exonerar.')
    return false
  }
  if (data.documentNumber.length == 0) {
    alertify.alert('ERROR', 'Debe ingresar un número de documento válido para exonerar.')
    return false
  }
  if (data.institutionName.length == 0) {
    alertify.alert('ERROR', 'Debe ingresar un nombre de institución válido para exonerar.')
    return false
  }
  if (data.documentDate.length == 0) {
    alertify.alert('ERROR', 'Debe ingresar una fecha de documento válida para exonerar.')
    return false
  }
  // IF ALL IS OK
  return true

}
