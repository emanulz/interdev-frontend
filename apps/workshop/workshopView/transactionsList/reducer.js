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
        default:
        {

        }
    }

    return state
}