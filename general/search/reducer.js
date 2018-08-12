const stateConst = {
  isVisible: false,
  searchText: '',
  searchResults: [],
  activeIndex: 0,
  activeImageName: '',
  activeImageCode: ''
}

const reducer = (namespace) => (state = stateConst, action) => {
  switch (action.type) {

    case `${namespace}_SET_ACTIVE_IMAGE`:
    {
      return {
        ...state,
        activeImageName: action.payload.name,
        activeImageCode: action.payload.code
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
        activeIndex: action.payload
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
