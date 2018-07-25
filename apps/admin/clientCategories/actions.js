// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

export function checkClientCategoryData(clientCategory, clientCategories) {
  let Ok = true

  if (clientCategory.code == '') {
    alertify.alert('Error', 'Debe especificar el código de la Familia')
    // alertify.notify('Debe especificar el código del Cliente', 'error', 5, function() { console.log('dismissed') })
    return false
  }

  if (clientCategory.name == '') {
    alertify.alert('Error', 'Debe especificar el nombre de la Familia')
    return false
  }

  // UNIQUE FIELDS
  clientCategories.forEach((clientCategoryData) => {
    if (clientCategory.code == clientCategoryData.code) {
      if (clientCategory.id != clientCategoryData.id) {
        alertify.alert('Error', `La Categoría de cliente ${clientCategoryData.name} ya posee el código ${clientCategoryData.code}`)
        Ok = false
        return false
      }
    }
  })

  return Ok
}
