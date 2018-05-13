import alertify from 'alertifyjs'


const stateConst = {
    parts:{},
    searchKey:''
}

//
export default function reducer(state=stateConst, action){


    switch(action.type){
        case 'FETCH_PRODUCTS_REJECTED':
        {
            return {
                ...state,
                parts:{}
            }
        }

        case 'FETCH_PRODUCTS_FULFILLED':
        {
            return {
                ...state,
                parts: action.payload
            }
        }

        case 'UPDATE_SEARCH_KEY':
        {
            return {
                ...state,
                searchKey: action.payload
            }
        }

        case 'CLEAR_SEARCH_KEY':
        {
            return {
                ...state,
                searchKey: ''
            }
        }

        case 'LABOR_QUICK_ENTRY':
        {
            console.log("LABOR_QUICK_ENTRY " + 
                action.payload.cost + action.payload.description)
            break
        }
        case 'INVALID_LABOR_QUICK_ENTRY':
        {
            alertify.alert('ERROR: ACELERADOR INVÁLIDO', 
                'El formato para ingresar mano de obra en forma rápida es mo*costo*descripción')           
            break
        }

        case 'CASH_ADVANCE_QUICK_ENTRY':
        {
            console.log("CASH_ADVANCE_QUICK_ENTRY " + action.payload.cost + 
                action.payload.description)
            break
        }
        case 'INVALID_CASH_ADVANCE_QUICK_ENTRY':
        {
            alertify.alert('ERROR: ACELERADOR INVÁLIDO', 
                'El formato para ingresar un adelanto en forma rápida es ad*costo')
            break
            }

    }

    return state
}