const stateConst = {
  pageSize: 10,
  total: 0,
  currentPage: 1,
  next: null,
  previous: null
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {
    case 'PAGINATION_DATA':
    {
      return {
        ...state,
        total: action.payload.total,
        next: action.payload.next,
        previous: action.payload.previous
      }
    }// case

    case 'SET_CURRENT_PAGE':
    {
      return {
        ...state,
        currentPage: action.payload
      }
    }// case

    case 'SET_PAGE_SIZE':
    {
      return {
        ...state,
        pageSize: action.payload
      }
    }// case

  } // switch

  return state // default return

} // reducer
