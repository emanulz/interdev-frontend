const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const stateConst = {
  creditVouchers: [],
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_CREDIT_VOUCHERS_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_CREDIT_VOUCHERS_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'FETCH_CREDIT_VOUCHERS_FULFILLED':
    {
      return {
        ...state,
        creditVouchers: action.payload
      }

    } // case

    case 'FETCH_CREDIT_VOUCHERS_REJECTED':
    {
      return {
        ...state,
        creditVouchers: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
