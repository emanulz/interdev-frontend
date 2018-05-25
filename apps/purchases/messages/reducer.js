import alertify from 'alertifyjs'

const stateConst = {
  messages: false
}

export default function reducer(state=stateConst, action) {
    switch(action.type) {
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
    }

    return state
}