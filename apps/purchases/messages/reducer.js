import alertify from 'alertifyjs'

const stateConst = {
  messages: false
}

export default function reducer(state=stateConst, action) {
    switch(action.type) {

      case 'CANT_PRINT_NOT_CLOSED_PURCHASE':
      {
        alertify.alert('No permitido', `No se permite imprimir tiquete de ingreso de producto de una compra no cerrada`)
        break       
      }

      case 'PRODUCT_ALREADY_IN_CART':
      {
        alertify.alert('No permitido', `El código ${action.payload} ya se incluyo en el ingreso de compra`)
        break
      }
      case 'FETCH_SUPPLIERS_REJECTED':
      {
        alertify.alert('Error', 'Error al cargar los datos de los proveedores')
        break
      }
      case 'FETCH_GLOBAL_PREF_REJECTED':
      {
        alertify.alert('Error', 'No se logró cargar las preferencias global del sistema')
        break
      }
      case 'SUPPLIER_NOT_FOUND':
      {
        alertify.alert('Error', `No se encontro un proveedor con código ${action.payload}`)
        break
      }
      case 'FETCH_WORKORDERS_REJECTED':
      {
        alertify.alert('ERROR: FALLO AL CARGAR COMPRAS',
          'Ocurrió un error al cargar la lista de compras')
        break
      }
      case 'FETCH_WAREHOUSES_REJECTED':
      {
        alertify.alert('ERROR: FALLO AL CARGAR LAS BODEGAS',
          'Ocurrió un error al cargar la lista de bodegas')
        break
      }

      case 'CHANGE_METHOD_DISABLED':
      {
        alertify.alert('ERROR: DESHABILITADO',
        'Las ordenes cerradas no se pueden editar')
        break
      }
    }

    return state
}