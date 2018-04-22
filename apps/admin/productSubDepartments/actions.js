// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

export function checkProductSubDepartmentData(productSubDepartment, productSubDepartments) {
  let Ok = true

  if (productSubDepartment.code == '') {
    alertify.alert('Error', 'Debe especificar el código de la Sub Familia')
    // alertify.notify('Debe especificar el código del Cliente', 'error', 5, function() { console.log('dismissed') })
    return false
  }

  if (productSubDepartment.name == '') {
    alertify.alert('Error', 'Debe especificar el nombre de la Sub Familia')
    return false
  }

  if (productSubDepartment.department == '') {
    alertify.alert('Error', 'Debe especificar una Familia a la que pertenece esta Sub Familia')
    return false
  }

  // UNIQUE FIELDS
  productSubDepartments.forEach((productSubDepartmentData) => {
    if (productSubDepartment.code == productSubDepartmentData.code) {
      if (productSubDepartment.id != productSubDepartmentData.id) {
        alertify.alert('Error', `La Familia ${productSubDepartmentData.name} ya posee el código ${productSubDepartmentData.code}`)
        Ok = false
        return false
      }
    }
  })

  return Ok
}
