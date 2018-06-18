const stateConst = {
    credit_movements: []
}

export default function reducer(state=stateConst, action) {

    switch(action.type) {
        case 'FETCH_PAYABLE_CRED_MOV_FULFILLED':
        {
            return {
                ...state,
                credit_movements: action.payload
            }
        }

        case 'FETCH_PAYABLE_CRED_MOV_REJECTED':
        {
            return {
                ...state,
                credit_movements: []
            }
        }
    }

    return state
}