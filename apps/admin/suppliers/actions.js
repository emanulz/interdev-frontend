// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

export function checkSupplierData(supplier, suppliers) {
  let Ok = true

  if (supplier.code == '') {
    alertify.alert('Error', 'Debe especificar el código del Proveedor')
    return false
  }

  if (supplier.name == '') {
    alertify.alert('Error', 'Debe especificar el nombre del Proveedor')
    return false
  }

  // UNIQUE FIELDS
  suppliers.forEach((supplierData) => {
    if (supplier.code == supplierData.code) {
      if (supplier.id != supplierData.id) {
        alertify.alert('Error', `El Proveedor ${supplierData.name} ${supplierData.last_name}
        ya posee el código ${supplierData.code}`)
        Ok = false
        return false
      }
    }
    if (supplier.id_num == supplierData.id_num && supplierData.id_num != '') {
      if (supplier.id != supplierData.id) {
        alertify.alert('Error', `El Proveedor ${supplierData.name} ${supplierData.last_name}
        ya posee la identificación ${supplierData.id_num}`)
        Ok = false
        return false
      }
    }
  })

  return Ok
}
