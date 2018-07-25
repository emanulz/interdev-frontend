
import alertify from 'alertifyjs'

import axios from 'axios'

export function importProducts(kwargs){

    return function(dispatch){
        axios({
            method: 'post',
            url: kwargs.url,
            data: kwargs.data
        })
        .then(response=>{
            alertify.alert("Éxito", "Productos importados satisfactoriamente")
            dispatch({type:'FETCHING_DONE'})
        }).catch(err=>{
            console.log("Error importando")
            console.log(err)
            if(err.response){
                console.log(err.response.data)
            }
    
            alertify.alert("Error")
            dispatch({type: 'FETCHING_DONE'})
        })
    }


}

export function checkImportData(warehouse, file){

    let OK = true

    const errors = []
    if(warehouse.id == '00000000-0000-0000-0000-000000000000'){
        errors.push('Se debe seleccionar la bodega de destino. De no haber opciones se debe crear una antes de importar')
    }

    if(file == ''){
        errors.push('Se debe seleccionar el archivo de origen de los productos antes de importar')
    }

    if(errors.length>0){
        let OK = false
        const message_text = errors.join('\n')
        alertify.alert('Error', message_text)

        return OK
    }

    return OK
}



