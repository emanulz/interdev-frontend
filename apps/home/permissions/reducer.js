const defaultPermissions = {
  access_administration: false,
  access_sales: false,
  access_presales: false,
  access_inventories: false,
  access_workshop: false,
  access_credits: false,
  access_purchases: false,
  access_restaurant: false,
  access_returns: false,
  access_payables: false
}

const stateConst = {
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_ACCESS_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_ACCESS_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

  } // switch

  return state // default return

} // reducer
