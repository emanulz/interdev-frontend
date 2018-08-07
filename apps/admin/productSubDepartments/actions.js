// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

export function checkProductSubDepartmentData(productSubDepartment, productSubDepartments) {
  let Ok = true
  if (productSubDepartment.identifier == '') {
    alertify.alert('Error', 'Debe especificar el Identificador de la Sub Familia')
    // alertify.notify('Debe especificar el código del Cliente', 'error', 5, function() { console.log('dismissed') })
    return false
  }

  if (productSubDepartment.name == '') {
    alertify.alert('Error', 'Debe especificar el nombre de la Sub Familia')
    return false
  }

  // UNIQUE FIELDS
  productSubDepartments.forEach((productSubDepartmentData) => {
    if (productSubDepartment.identifier == productSubDepartmentData.identifier) {
      if (productSubDepartment.id != productSubDepartmentData.id) {
        alertify.alert('Error', `La Sub-Familia ${productSubDepartmentData.name} ya posee el identificador ${productSubDepartmentData.identifier}`)
        Ok = false
        return false
      }
    }
  })

  return Ok
}
