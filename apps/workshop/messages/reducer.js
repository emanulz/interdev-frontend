import alertify from 'alertifyjs'

const stateConst = {
    messgaes: false
}

export default function reducer(state = stateConst, action){
    switch (action.type){
        case 'PRODUCT_NOT_FOUND':
        {
            alertify.alert('ERROR: NO EXISTE PRODUCTO!','El código ingresado no existe en el sistema, ingrese un código válido')
            return{
                ...state,
                messages:true
            }
        }

        case 'PRODUCT_SOLD_OUT':
        {
          alertify.alert('PRODUCTO AGOTADO!', 'No hay existencias del producto en bodega')
    
          return {
            ...state,
            messages: true
          }
        } // case       

        case 'NEW_WORKORDER':
        {
          state = stateConst
          return {
            ...state,
            stateConst
          }
        } // case
    }
}