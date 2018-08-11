const stateConst = {
  isVisible: false,
  searchText: '',
  searchResults: [],
  activeindex: 0
}

const reducer = (namespace) => (state = stateConst, action) => {
  switch (action.type) {
    case `${namespace}_INCREASE_ACTIVE_INDEX`:
    {
      const searchResultsMax = state.searchResults.length - 1
      let activeindex = state.activeindex + 1
      if (activeindex > searchResultsMax) {
        activeindex = 0
      }
      return {
        ...state,
        activeindex: activeindex
      }
    } // case

    case `${namespace}_DECREASE_ACTIVE_INDEX`:
    {
      const searchResultsMax = state.searchResults.length - 1
      let activeindex = state.activeindex - 1
      if (activeindex < 0) {
        activeindex = searchResultsMax
      }
      return {
        ...state,
        activeindex: activeindex
      }
    } // case

    case `${namespace}_SET_ACTIVE_INDEX`:
    {
      return {
        ...state,
        activeindex: action.payload
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

    case `${namespace}_CLEAR_SEARCH_RESULTS`:
    {
      return {
        ...state,
        searchResults: []
      }
    } // case

  }
  return state
} // reducer

export default reducer
