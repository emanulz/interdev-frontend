const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const stateConst = {
  presales: [],
  restaurant: [],
  quoting: [],
  reserves: [],
  nsreserves: [],
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_PRESALE_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_PRESALE_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'FETCH_PRESALES_FULFILLED':
    {
      return {
        ...state,
        presales: action.payload
      }

    } // case

    case 'FETCH_PRESALES_REJECTED':
    {
      return {
        ...state,
        presales: []
      }
    } // case

    case 'FETCH_RESTAURANT_PRESALES_FULFILLED':
    {
      return {
        ...state,
        restaurant: action.payload
      }

    } // case

    case 'FETCH_RESTAURANT_PRESALES_REJECTED':
    {
      return {
        ...state,
        restaurant: []
      }
    } // case

    case 'FETCH_QUOTING_PRESALES_FULFILLED':
    {
      return {
        ...state,
        quoting: action.payload
      }

    } // case

    case 'FETCH_QUOTINGT_PRESALES_REJECTED':
    {
      return {
        ...state,
        quoting: []
      }
    } // case

    case 'FETCH_RESERVES_PRESALES_FULFILLED':
    {
      return {
        ...state,
        reserves: action.payload
      }

    } // case

    case 'FETCH_RESERVES_PRESALES_REJECTED':
    {
      return {
        ...state,
        reserves: []
      }
    } // case

    case 'FETCH_NSRESERVES_PRESALES_FULFILLED':
    {
      return {
        ...state,
        nsreserves: action.payload
      }

    } // case

    case 'FETCH_NSRESERVES_PRESALES_REJECTED':
    {
      return {
        ...state,
        nsreserves: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
