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

    }
    return state
}