const stateConst = {
  isVisible: false,
  searchText: '',
  searchResults: [],
  paginatedSearchResults: [],
  activeIndex: 0,
  paginatedIndex: 1,
  hasNext: false,
  hasPrevious: false,
  paginatedPageSize: 9,
  activeImageName: '',
  activeImageCode: '',
  previousSearch: '',
  activeCode: '',
  needsRefetch: false
}

const reducer = (namespace) => (state = stateConst, action) => {
  switch (action.type) {

    case `${namespace}_SET_ACTIVE_IMAGE`:
    {
      return {
        ...state,
        activeImageName: action.payload.name,
        activeImageCode: action.payload.code,
        activeCode: action.payload.code
      }
    }

    case `${namespace}_INCREASE_ACTIVE_INDEX`:
    {
      const searchResultsMax = state.searchResults.length - 1
      let activeIndex = state.activeIndex + 1
      if (activeIndex > searchResultsMax) {
        activeIndex = 0
      }
      return {
        ...state,
        activeIndex: activeIndex
      }
    } // case

    case `${namespace}_DECREASE_ACTIVE_INDEX`:
    {
      const searchResultsMax = state.searchResults.length - 1
      let activeIndex = state.activeIndex - 1
      if (activeIndex < 0) {
        activeIndex = searchResultsMax
      }
      return {
        ...state,
        activeIndex: activeIndex
      }
    } // case

    case `${namespace}_SET_ACTIVE_INDEX`:
    {
      return {
        ...state,
        activeIndex: action.payload,
        needsRefetch: true
      }
    } // case

    case `${namespace}_SET_PREVIOUS_SEARCH`:
    {
      return {
        ...state,
        previousSearch: action.payload
      }
    } // case

    case `${namespace}_TOGGLE_SEARCH_PANEL`:
    {
      const visibleOrNot = state.isVisible
      return {
        ...state,
        isVisible: !visibleOrNot
      }
    } // case

    case `${namespace}_HIDE_SEARCH_PANEL`:
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case `${namespace}_SET_SEARCH_TEXT`:
    {
      return {
        ...state,
        searchText: action.payload
      }
    } // case

    case `${namespace}_CLEAR_SEARCH_TEXT`:
    {
      return {
        ...state,
        searchText: ''
      }
    } // case

    case `${namespace}_SET_SEARCH_RESULTS`:
    {
      return {
        ...state,
        searchResults: action.payload
      }
    } // case

    case `${namespace}_SET_PAGINATED_SEARCH_RESULTS`:
    {
      return {
        ...state,
        paginatedSearchResults: action.payload.results,
        hasNext: action.payload.has_next,
        hasPrevious: action.payload.has_previous,
        needsRefetch: false
      }
    } // case

    case `${namespace}_SET_PAGINATED_PAGE_SIZE`:
    {
      return {
        ...state,
        paginatedPageSize: action.payload,
        paginatedIndex: 0,
        needsRefetch: true
      }
    } // case

    case `${namespace}_SET_PAGINATED_INDEX`:
    {
      return {
        ...state,
        paginatedIndex: action.payload,
        needsRefetch: true
      }
    } // case

    case `${namespace}_CLEAR_SEARCH_RESULTS`:
    {
      return {
        ...state,
        searchResults: [],
        paginatedSearchResults: [],
        paginatedIndex: 0,
        paginatedPageSize: 9,
        hasNext: false,
        hasPrevious: false
      }
    } // case

  }
  return state
} // reducer

export default reducer
