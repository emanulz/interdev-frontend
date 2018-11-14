import alertify from 'alertifyjs'

import axios from 'axios'

export function validateFile(file){
    console.log("File received")
    console.log(file)

    let OK = true

    if(file ===''){
        OK = false
        return OK
    }

    return OK
}

export function importData(kwargs){

    const onSuccess = kwargs.onSuccess
    const onFailure = kwargs.onFailure

    return function(dispatch){
        axios({
            method: 'post',
            url: kwargs.url,
            data: kwargs.data
        })
        .then(response=>{
            alertify.alert("Éxito", "Mercaderia importada satisfactoriamente")
            dispatch({type: onSuccess, payload: response.data})
            dispatch({type:'FETCHING_DONE'})
        }).catch(err=>{
            console.log("Error importando Mercaderia")
            console.log(err)
            let err_data =''
            if(err.response){
                console.log(err.response.data)
                err_data = err.response.data
            }
            dispatch({type: onFailure, payload: err_data})
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
        errors.push('Se debe seleccionar el archivo de importación antes de proceder.')
    }

    if(errors.length>0){
        let OK = false
        const message_text = errors.join('\n')
        alertify.alert('Error', message_text)

        return OK
    }

    return OK
}