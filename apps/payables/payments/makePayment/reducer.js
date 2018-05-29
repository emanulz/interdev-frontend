let inspect = require('util-inspect')


const stateConst = {
    paymentArray : [],
}

export default function reducer(state=stateConst, action) {
    switch(action.type) {
        case 'SET_PAYMENTS':
        {
            return {
                ...state,
                paymentArray: action.payload
            }
        }
        case 'CLEAR_PAYMENTS':
        {
            return {
                ...state,
                paymentArray: []
            }
        }
        case 'SET_PAYMENT_AMOUNT':
        {
            const new_payment = JSON.parse(JSON.stringify(state.paymentArray))
            const index = new_payment.findIndex(a=>a.id == action.payload.id)
            new_payment[index] = action.payload
            return {
                ...state,
                paymentArray: new_payment
            }
        }
    }

    return state
}