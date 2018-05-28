import alertify from 'alertifyjs'

const stateConst = {

}

export default function reducer(state=stateConst, action) {
    switch(action.type) {
        case 'FETCH_SUPPLIERS_REJECTED':
        {
            alertify.alert('ERROR', 'No se pudieron cargar los datos de los proveedores')
            break
        }

        case 'FETCH_PAYABLE_CRED_MOV_REJECTED':
        {
            alertify.alert('ERROR', 'No se pudieron cargar los datos de los movimientos de crédito')
            break
        }
    }

    return state
}