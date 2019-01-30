const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const stateConst = {
  cashAdvances: [],
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_CASH_ADVANCES_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_CASH_ADVANCES_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'FETCH_CASH_ADVANCES_FULFILLED':
    {
      return {
        ...state,
        cashAdvances: action.payload
      }

    } // case

    case 'FETCH_CASH_ADVANCES_REJECTED':
    {
      return {
        ...state,
        cashAdvances: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
