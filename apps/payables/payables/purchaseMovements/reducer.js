const purchaseModel = {
    id: '0000'
}

const stateConst = {
    purchaseActive: purchaseModel,
    purchaseMovements: [],
}

export default  function reducer(state = stateConst, action){

    switch(action.type) {
        case 'CLEAR_PURCHASE':
        {
            return {
                ...state,
                purchaseActive:[],
                purchaseMovements: [],
            }
        }
        case 'SET_PURCHASE':
        {
            return {
                ...state,
                purchaseActive: action.payload
            }
        }
        case 'FETCH_PAYABLE_CREDIT_MOVEMENTS_FULFILLED':
        {
            return {
                ...state,
                purchaseMovements: action.payload,
            }
        }
        case 'FETCH_PAYABLE_CREDIT_MOVEMENTS_REJECTED':
        {
            return {
                ...state,
                purchaseMovements:[],
            }
        }
    }

    return state
}