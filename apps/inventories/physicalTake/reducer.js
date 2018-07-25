
const stateConst = {
  fullWidth: false,
  warehouse_id: '',
  description: '',
  type: 'COMPLETE',
  physicalTakes: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'TOGGLE_FULL_WIDTH_PHYSICAL':
    {
      const width = !state.fullWidth
      return {
        ...state,
        fullWidth: width
      }
    } // case

    case 'FETCH_PHYSICAL_TAKES_FULFILLED':
    {
      return {
        ...state,
        physicalTakes: action.payload
      }
    } // case

    case 'FETCH_PHYSICAL_TAKES_REJECTED':
    {
      return {
        ...state,
        physicalTakes: {}
      }
    } // case

    case 'CLEAR_PHYSICAL_TAKES':
    {
      return {
        ...state,
        physicalTakes: {}
      }
    } // case

    case 'SET_PHYSICAL_TAKE_WH_ID':
    {
      return {
        ...state,
        warehouse_id: action.payload
      }
    } // case

    case 'SET_PHYSICAL_TAKE_TYPE':
    {
      return {
        ...state,
        type: action.payload
      }
    } // case

    case 'SET_PHYSICAL_TAKE_DESCRIPTION':
    {
      return {
        ...state,
        description: action.payload
      }
    } // case

    case 'CLEAR_PHYSICAL_TAKE_DATA':
    {
      return {
        ...state,
        warehouse_id: '',
        description: '',
        type: 'COMPLETE'
      }
    } // case

  } // switch

  return state // default return

} // reducer
