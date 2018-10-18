const stateConst = {
    fullWidth: false,
    saleConsecutive: -1
  }
  
  export default function reducer(state = stateConst, action) {
  
    switch (action.type) {
  
      case 'TOGGLE_FULL_WIDTH':
      {
        const width = !state.fullWidth
        return {
          ...state,
          fullWidth: width
        }
      } // case

      case 'SET_SALE_CONSECUTIVE':
      {
        return {
          ...state,
          saleConsecutive: action.payload
        }
      }

      case 'NOTE_APPLIED':
      {
        
        return {
          ...state,
        }
      }

      case 'NOTE_REJECTED':
      {
        return {
          ...state,
        }
      }
  
    } // switch
  
    return state // default return
  
  } // reducer
  