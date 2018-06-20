const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const clientCategoryModel = {
  id: '0000000000',
  code: '',
  name: '',
  discount: 0,
  observations: ''
}

const stateConst = {
  clientCategories: [],
  clientCategoryActive: clientCategoryModel,
  clientCategoryActiveOld: clientCategoryModel,
  nextClientCategory: 0,
  previousClientCategory: 0,
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_CLIENT_CATEGORY_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_CLIENT_CATEGORY_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'SET_NEXT_PREV_CLIENT_CATEGORY':
    {
      return {
        ...state,
        nextClientCategory: action.payload.next,
        previousClientCategory: action.payload.previous
      }
    } // case

    case 'CLEAR_NEXT_PREV_CLIENT_CATEGORY':
    {
      return {
        ...state,
        nextClientCategory: 0,
        previousClientCategory: 0
      }
    } // case

    case 'FETCH_CLIENT_CATEGORIES_FULFILLED':
    {
      return {
        ...state,
        clientCategories: action.payload
      }

    } // case

    case 'FETCH_CLIENT_CATEGORIES_REJECTED':
    {
      return {
        ...state,
        clientCategories: []
      }
    } // case

    case 'SET_CLIENT_CATEGORY':
    {
      return {
        ...state,
        clientCategoryActive: action.payload
      }
    }

    case 'SET_CLIENT_CATEGORY_OLD':
    {
      return {
        ...state,
        clientCategoryActiveOld: action.payload
      }
    }

    case 'CLEAR_CLIENT_CATEGORY':
    {
      return {
        ...state,
        clientCategoryActive: clientCategoryModel,
        clientCategoryActiveOld: clientCategoryModel
      }
    }

  } // switch

  return state // default return

} // reducer
