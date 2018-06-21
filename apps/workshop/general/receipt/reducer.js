
const stateConst = {
    isVisible: false,
    isFull: false,
    isPartRequestReceipt: false,
}

export default function reducer(state=stateConst, action) {
    switch (action.type) {
        case 'SHOW_RECEIPT_PANEL':
        {
            return {
                ...state,
                isVisible: true
            }
        }

        case 'HIDE_RECEIPT_PANEL':
        {
            return {
                ...state,
                isVisible: false
            }
        }

        case 'SET_REQUEST_RECEIPT':
        {
            return {
                ...state,
                isPartRequestReceipt: true
            }
        }

        case 'SET_RECEPTION_RECEIPT':
        {
            return {
                ...state,
                isPartRequestReceipt: false
            }
        }
    }

    return state
}