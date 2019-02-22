import alertify from 'alertifyjs'

const stateConst = {

}

export default function reducer(state=stateConst, action){

    switch(action.type){
        case 'PRODUCT_INSIGHT_REJECTED':
        {
            alertify.alert('Error', 'No se pudo obtener información para el producto')
            break
        }
        case 'TOO_MANY_RECORDS':
        {
            alertify.alert('Info', 'Se limitará la cantidad de registros a ' + action.payload)
            break
        }
        case 'IS_NAN':
        {
            alertify.alert('Error', 
                'El parámetro de cantidad de registros debe ser un número y no ' + action.payload)
            break
        }
        case 'PRODUCT_CODE_NOT_SET':
        {
            alertify.alert('Info', 'Deber primero seleccionar un código de producto.')
            break
        }


    }

    return state


}