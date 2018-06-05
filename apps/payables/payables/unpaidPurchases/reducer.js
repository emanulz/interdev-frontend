
const stateConst = {
    supplierActivePurchasesWithDebt: [],
    supplierActiveMovements: [],
}

export default function reducer(state = stateConst, action) {
    switch(action.type) {
        case 'FETCH_SUPPLIER_PURCHASES_WITH_DEBT_FULFILLED':
        {
            return {
                ...state,
                supplierActivePurchasesWithDebt: action.payload
            }
        }

        case 'FETCH_SUPPLIER_PURCHASES_WITH_DEBT_REJECTED':
        {
            return {
                ...state, 
                supplierActivePurchasesWithDebt: []
            }
        }

        case 'CLEAR_SUPPLIER_PURCHASES_WITH_DEBT':
        {
            return {
                ...state,
                supplierActivePurchasesWithDebt: []
            }
        }
    }

    return state
}