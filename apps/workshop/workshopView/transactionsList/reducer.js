import alertify from 'alertifyjs'
let inspect = require('util-inspect')

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
            newPartsList[action.payload.index] = action.payload.item
            return {
                ...state,
                partsRequestList : newPartsList
            }
        }

        case 'DELETE_PART_FROM_LIST':
        {
            const newPartsList = [...state.partsRequestList]
            newPartsList.splice(action.payload.index,1)
            return {
                ...state,
                partsRequestList: newPartsList
            }
        }
        default:
        {

        }
    }

    return state
}