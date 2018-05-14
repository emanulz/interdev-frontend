import alertify from 'alertifyjs'

const stateConst = {
    cashAdvanceList:[],
    partsRequestList:[],
    laborList:[],
    

}


export default function reducer(state=stateConst, action){

    switch(action.type){
        case 'CLEAR_TRANSACTIONS_LIST':
        {
            
            //newCashAdvanceList = []
            //newPartsRequestList = []
            //newLaborList = []
            return{
                ...state,
                cashAdvanceList : [],
                partsRequestList : [],
                laborList : []
            }
        }

        case 'ADD_TO_LABOR_LIST':
        {
            return {
                ...state,
                laborList:[
                    ...state.laborList,
                    action.payload
                ]
            }
        }

        case 'ADD_TO_CASH_ADVANCE_LIST':
        {
            return {
                ...state,
                cashAdvanceList:[
                    ...state.cashAdvanceList,
                    action.payload
                ]
            }
        }

        case 'ADD_TO_PARTS_LIST':
        {
            return {
                ...state,
                partsRequestList: [
                    ...state.partsRequestList,
                    action.payload
                ]
            }
        }
        case 'UPDATE_PARTS_LIST':
        {
            const newPartsList = [...state.partsRequestList]
            newPartsList[action.payload.index] = action.payload.part
            return {
                ...state,
                partsRequestList : newPartsList
            }
        }
        default:
        {

        }
    }

    return state
}