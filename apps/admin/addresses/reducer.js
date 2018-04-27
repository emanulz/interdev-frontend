const stateConst = {
  provinces: [],
  cantons: [],
  districts: [],
  towns: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_PROVINCES_FULFILLED':
    {
      return {
        ...state,
        provinces: action.payload
      }

    } // case

    case 'FETCH_PROVINCES_REJECTED':
    {
      return {
        ...state,
        provinces: []
      }
    } // case

    case 'FETCH_CANTONS_FULFILLED':
    {
      return {
        ...state,
        cantons: action.payload
      }

    } // case

    case 'FETCH_CANTONS_REJECTED':
    {
      return {
        ...state,
        cantons: []
      }
    } // case

    case 'FETCH_DISTRICTS_FULFILLED':
    {
      return {
        ...state,
        districts: action.payload
      }

    } // case

    case 'FETCH_DISTRICTS_REJECTED':
    {
      return {
        ...state,
        districts: []
      }
    } // case

    case 'FETCH_TOWNS_FULFILLED':
    {
      return {
        ...state,
        towns: action.payload
      }

    } // case

    case 'FETCH_TOWNS_REJECTED':
    {
      return {
        ...state,
        towns: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
