import alertify from 'alertifyjs'

const stateConst = {
    messages: false
}

export default function reducer(state = stateConst, action){
    switch (action.type){

        case 'CANT_CLOSE_WITHOUT_MOVES':
        {
          alertify.alert('No permitido', `No se puede cerrar una orden de trabajo sin movimientos.`)
          break  
        }

        case 'CANT_CLOSE_WITHOUT_MOVES_NO_REPAIR':
        {
          alertify.alert('No permitido', `No se puede cerrar una orden de trabajo como "Sin reparación" sin un movimiento informativo.`)
          break  
        }

        case 'CANT_CLOSE_NO_REPAIR_WITH_PARTS_REQUEST':
        {
            alertify.alert('ERROR: NO SE PUEDE CERRAR ORDEN!', 'Para cerrar una orden como  "SIN REPARACIÓN" es necesario eliminar sus requisiciones de parte. ' + 
                'Borre las requisiciones, guarde la orden y trate de cerrarla "SIN REPARACIÓN nuevamente.')
            return {
              ...state,
              messages: true
            }
        }

        case 'CANT_PRINT_NO_REPAIR_RECEIPT':
        {
            alertify.alert('ERROR: NO SE PUEDE IMPRIMIR RECIBO', 'Para imprimir un recibo de "SIN REPARACIÓN" la orden debe cerrarse primero de esa forma.')
            return {
              ...state,
              messages: true
            }
        }

        case 'PRODUCT_CART_ADD_VALIDATION':
        {
            alertify.alert('ERROR: NO SE PUEDE AGREGAR PRODUCTO!', action.payload)
            return {
              ...state,
              messages: true
            }
        }

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