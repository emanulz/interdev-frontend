const stateConst = {
    isVisible: true
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
    }

    return state
}