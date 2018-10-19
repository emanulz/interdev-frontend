const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const stateConst = {
  registerClosures: [],
  registerClosureActive: {},
  registerClosureActiveMovements: [],
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_REGISTER_CLOSURE_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_REGISTER_CLOSURE_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'FETCH_REGISTER_CLOSURES_FULFILLED':
    {
      return {
        ...state,
        registerClosures: action.payload
      }

    } // case

    case 'FETCH_REGISTER_CLOSURES_REJECTED':
    {
      return {
        ...state,
        registerClosures: []
      }
    } // case

    case 'FETCH_REGISTER_CLOSURE_FULFILLED':
    {
      return {
        ...state,
        registerClosureActive: action.payload
      }

    } // case

    case 'FETCH_REGISTER_CLOSURE_REJECTED':
    {
      return {
        ...state,
        registerClosureActive: {}
      }
    } // case

    case 'CLEAR_REGISTER_CLOSURE_ACTIVE':
    {
      return {
        ...state,
        registerClosureActive: {}
      }

    } // case

    case 'CLEAR_REGISTER_CLOSURE_ACTIVE_MOVEMENTS':
    {
      return {
        ...state,
        registerClosureActiveMovements: []
      }

    } // case

    case 'FETCH_REGISTER_CLOSURE_MOVEMENTS_FULFILLED':
    {
      return {
        ...state,
        registerClosureActiveMovements: action.payload
      }

    } // case

    case 'FETCH_REGISTER_CLOSURE_MOVEMENTS_REJECTED':
    {
      return {
        ...state,
        registerClosureActiveMovements: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
