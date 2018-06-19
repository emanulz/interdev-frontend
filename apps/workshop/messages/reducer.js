import alertify from 'alertifyjs'

const stateConst = {
    messages: false
}

export default function reducer(state = stateConst, action){
    switch (action.type){

        case 'CANT_DELETE_FROM_CLOSED_ORDER':
        {
            alertify.alert('AVISO: ORDEN CERRADA!', 'No se pueden eliminar líneas de una orden cerrada.')
            return {
              ...state,
              messages: true
            }            
        }
        
        case 'ORDER_ALREADY_CREATED':
        {
            alertify.alert('AVISO: ORDEN YA EXISTE!', 'La orden ya habia sido creada, no puede crear un duplicado')
            return {
              ...state,
              messages: true
            }  
        }

        case 'CANT_PRINT_UNSAVED':
        {
            alertify.alert('AVISO: ORDEN SIN CREAR!', 'La orden orden debe crearse antes de que se pueda imprimir el comprobante de recepción')
            return {
              ...state,
              messages: true
            }       
        }

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