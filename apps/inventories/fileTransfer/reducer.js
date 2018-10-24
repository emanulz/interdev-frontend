const stateConst = {
    fullWidth: false,
    clientVisible: false,
    priceListVisible: false,
    showCurrency: false,
    uniqueId: ''
}

export default function reducer(state=stateConst, action) {
    switch(action.type){
        case 'SET_UNIQUE_ID':
        {
            return {
                ...state,
                uniqueId: action.payload
            }
        }

        case 'TOGGLE_FULL_WIDTH':
        {
          const width = !state.fullWidth
          return {
            ...state,
            fullWidth: width
          }
        }
    }

    return state
}