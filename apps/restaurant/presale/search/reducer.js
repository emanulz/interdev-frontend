const stateConst = {
  isVisible: false,
  searchText: '',
  searchResults: [],
  products: [],
  departments: [],
  departmentActive: ''
}

export default function reducer(state = stateConst, action) {
  switch (action.type) {

    case `productSearch_TOGGLE_SEARCH_PANEL`:
    {
      const visibleOrNot = state.isVisible
      return {
        ...state,
        isVisible: !visibleOrNot
      }
    } // case

    case `productSearch_HIDE_SEARCH_PANEL`:
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case `SEARCH_RESTAURANT_SET_SEARCH_TEXT`:
    {
      return {
        ...state,
        searchText: action.payload
      }
    } // case

    case `SEARCH_RESTAURANT_CLEAR_SEARCH_TEXT`:
    {
      return {
        ...state,
        searchText: ''
      }
    } // case

    case `SEARCH_RESTAURANT_SET_SEARCH_RESULTS`:
    {
      return {
        ...state,
        searchResults: action.payload
      }
    } // case

    case `SEARCH_RESTAURANT_CLEAR_SEARCH_RESULTS`:
    {
      return {
        ...state,
        searchResults: []
      }
    } // case

    case `SEARCH_RESTAURANT_FETCH_PRODUCTS`:
    {
      return {
        ...state,
        products: action.payload
      }
    } // case

    case `SEARCH_RESTAURANT_FETCH_DEPARTMENTS`:
    {
      return {
        ...state,
        departments: action.payload,
        departmentActive: action.payload[0].id
      }
    } // case

    case `SEARCH_RESTAURANT_FETCH_ERROR`:
    {
      return {
        ...state,
        products: [],
        departments: []
      }
    } // case

    case `SEARCH_RESTAURANT_SET_DEPARTMENT_ACTIVE`:
    {
      return {
        ...state,
        departmentActive: action.payload
      }
    } // case

    case `SEARCH_RESTAURANT_CLEAR_DEPARTMENT_ACTIVE`:
    {
      return {
        ...state,
        departmentActive: ''
      }
    } // case

    case `CLEAR_PRODUCTS`:
    {
      return {
        ...state,
        products: []
      }
    } // case

    case `CLEAR_DEPARTMENTS`:
    {
      return {
        ...state,
        departments: []
      }
    } // case

  }
  return state
} // reducer
