const stateConst = {
  tableBills: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_TABLES_FULFILLED':
    {
      return {
        ...state,
        tableBills: action.payload
      }

    } // case

    case 'FETCH_TABLES_REJECTED':
    {
      return {
        ...state,
        tableBills: []
      }

    } // case

  }

  return state // default return
}
