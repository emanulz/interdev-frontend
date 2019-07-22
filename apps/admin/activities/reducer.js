const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const activityModel = {
  id: '0000000000',
  identifier: '',
  name: '',
  description: '',
  is_active: true
}

const stateConst = {
  activities: [],
  activityActive: activityModel,
  activityActiveOld: activityModel,
  nextActivity: 0,
  previousActivity: 0,
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_ACTIVITY_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_ACTIVITY_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'SET_NEXT_PREV_ACTIVITY':
    {
      return {
        ...state,
        nextActivity: action.payload.next,
        previousActivity: action.payload.previous
      }
    } // case

    case 'CLEAR_NEXT_PREV_ACTIVITY':
    {
      return {
        ...state,
        nextActivity: 0,
        previousActivity: 0
      }
    } // case

    case 'FETCH_ACTIVITIES_FULFILLED':
    {
      return {
        ...state,
        activities: action.payload
      }

    } // case

    case 'FETCH_ACTIVITIES_REJECTED':
    {
      return {
        ...state,
        activities: []
      }
    } // case

    case 'SET_ACTIVITY':
    {
      return {
        ...state,
        activityActive: action.payload
      }
    }

    case 'SET_ACTIVITY_OLD':
    {
      return {
        ...state,
        activityActiveOld: action.payload
      }
    }

    case 'CLEAR_ACTIVITY':
    {
      return {
        ...state,
        activityActive: activityModel,
        activityActiveOld: activityModel
      }
    }

  } // switch

  return state // default return

} // reducer
