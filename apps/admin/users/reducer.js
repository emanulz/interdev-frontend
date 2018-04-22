const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const userModel = {
  id: '0000000000',
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password2: '',
  groups: [],
  user_permissions: [],
  is_active: true
}

const profileModel = {
  user: '',
  avatar: '',
  birth_date: '',
  id_num: '',
  pin: ''
}

const stateConst = {
  users: [],
  userActive: userModel,
  userActiveOld: userModel,
  userProfileActive: profileModel,
  userProfileActiveOld: profileModel,
  nextUser: 0,
  previousUser: 0,
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_USER_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_USER_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'SET_NEXT_PREV_USER':
    {
      return {
        ...state,
        nextUser: action.payload.next,
        previousUser: action.payload.previous
      }
    } // case

    case 'CLEAR_NEXT_PREV_USER':
    {
      return {
        ...state,
        nextUser: 0,
        previousUser: 0
      }
    } // case

    case 'FETCH_USERS_FULFILLED':
    {
      return {
        ...state,
        users: action.payload
      }

    } // case

    case 'FETCH_USERS_REJECTED':
    {
      return {
        ...state,
        users: []
      }
    } // case

    case 'SET_USER':
    {
      return {
        ...state,
        userActive: action.payload
      }
    }

    case 'SET_USER_OLD':
    {
      return {
        ...state,
        userActiveOld: action.payload
      }
    }

    case 'CLEAR_USER':
    {
      return {
        ...state,
        userActive: userModel,
        userActiveOld: userModel
      }
    }

    case 'SET_USERPROFILE':
    {
      return {
        ...state,
        userProfileActive: action.payload
      }
    }

    case 'SET_USERPROFILE_OLD':
    {
      return {
        ...state,
        userProfileActiveOld: action.payload
      }
    }

    case 'CLEAR_USERPROFILE':
    {
      return {
        ...state,
        userProfileActive: profileModel,
        userProfileActiveOld: profileModel
      }
    }

  } // switch

  return state // default return

} // reducer
