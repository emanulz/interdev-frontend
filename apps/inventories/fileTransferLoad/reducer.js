import alertify from 'alertifyjs'

const stateConst = {
    transferData: [],
    load_preview: false
}

export default function reducer(state=stateConst, action) {
    switch(action.type){

        case 'TAG_FOR_PREVIEW_LOAD':
        {
            return {
                ...state, 
                load_preview: true
            }
        }

        case 'UNTAG_FOR_PREVIEW_LOAD':
        {
            return {
                ...state,
                load_preview: false
            }
        }

        case 'MERCHANDISE_LOAD_SUCCESFULLY':
        {
            return {
                ...state,
                
            }
        }

        case 'MERCHANDISE_LOAD_FAILURE':
        {
            let message = `Error cargando transferencia de inventario ${action.payload}`
            alertify.alert("Error", message)
            return {
                ...state
            }
        }

        case 'MERCHANDISE_PREVIEW_LOAD_FAIL':
        {
            let message = `Error cargando previsualización de transferencia ${action.payload}`
            alertify.alert("Error", message)
            return {
                ...state
            }
        }

        case 'MERCHANDISE_PREVIEW_LOAD_SUCCESS':
        {
            console.log("Dispatch after preview loaded")
            console.log(action.payload)
            return {
                ...state,
                transferData: action.payload
            }
        }


        
    }

    return state
}