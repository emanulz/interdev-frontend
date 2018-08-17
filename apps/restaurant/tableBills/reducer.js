const stateConst = {
  tableBills: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_TABLE_BILLS_FULFILLED':
    {
      return {
        ...state,
        tableBills: action.payload
      }

    } // case

    case 'FETCH_TABLE_BILLS_REJECTED':
    {
      return {
        ...state,
        tableBills: []
      }

    } // case

  }

  return state // default return
}
