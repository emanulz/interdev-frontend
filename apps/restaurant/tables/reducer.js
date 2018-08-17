const stateConst = {
  tables: [],
  tableActive: ''
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_TABLES_FULFILLED':
    {
      return {
        ...state,
        tables: action.payload
      }

    } // case

    case 'FETCH_TABLES_REJECTED':
    {
      return {
        ...state,
        tables: []
      }

    } // case

    case 'SET_TABLE_ACTIVE':
    {
      return {
        ...state,
        tableActive: action.payload
      }

    } // case

    case 'CLEAR_TABLE_ACTIVE':
    {
      return {
        ...state,
        tableActive: ''
      }

    } // case

  }

  return state // default return
}
