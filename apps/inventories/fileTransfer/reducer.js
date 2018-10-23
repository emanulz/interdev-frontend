const stateConst = {
    fullWidth: false
}

export default function reducer(state=stateConst, action) {
    switch(action.type){
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