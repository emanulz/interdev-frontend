const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const stateConst = {
  sales: [],
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_SALE_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_SALE_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'FETCH_SALES_FULFILLED':
    {
      return {
        ...state,
        sales: action.payload
      }

    } // case

    case 'FETCH_SALES_REJECTED':
    {
      return {
        ...state,
        sales: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
