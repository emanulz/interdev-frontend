import alertify from 'alertifyjs'

const stateConst = {
    messages: false
}

export default function reducer(state = stateConst, action){
    switch (action.type){
 
        case 'CLIENT_NOT_FOUND':
        {
          alertify.alert('ERROR: NO EXISTE CLIENTE!', 'El cliente con el código ingresado no existe en el sistema, ingrese un código válido')
          return {
            ...state,
            messages: true
          }
        } // case

        case 'CASH_ADVANCE_INVALID':
        {
            alertify.alert('ERROR: MONTO DE ADELANTO INVÁLIDO',
                'El adelando de dinero debe ser un valor númerico')
            return {
                ...state,
                messages: true
            }
        }

        case 'INVALID_NUMERIC_VALUE':
        {
            alertify.alert('Error', 'Debe ingresar un valor numérico')
            return {
                ...state,
                messages: true
            }
        }

        case 'PART_NOT_FOUND':
        {
            alertify.alert('ERROR: CÓDIGO DE PARTE NO ENCONTRADO',
                'El código de parte no se encuentra en el sistema')
            return {
                ...state,
                messages: true
            }

        }

    }
    return state
}