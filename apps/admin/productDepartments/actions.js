// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

export function checkProductDepartmentData(productDepartment, productDepartments) {
  let Ok = true

  if (productDepartment.code == '') {
    alertify.alert('Error', 'Debe especificar el código de la Familia')
    // alertify.notify('Debe especificar el código del Cliente', 'error', 5, function() { console.log('dismissed') })
    return false
  }

  if (productDepartment.name == '') {
    alertify.alert('Error', 'Debe especificar el nombre de la Familia')
    return false
  }

  // UNIQUE FIELDS
  productDepartments.forEach((productDepartmentData) => {
    if (productDepartment.code == productDepartmentData.code) {
      if (productDepartment.id != productDepartmentData.id) {
        alertify.alert('Error', `La Familia ${productDepartmentData.name} ya posee el código ${productDepartmentData.code}`)
        Ok = false
        return false
      }
    }
  })

  return Ok
}
