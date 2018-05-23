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

      case 'SUPPLIER_NOT_FOUND':
      {
        alertify.alert('Error', `No se encontro un proveedor con código ${action.payload}`)
        break
      }
    }

    return state
}