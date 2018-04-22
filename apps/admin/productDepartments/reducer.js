const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const productDepartmentModel = {
  id: '0000000000',
  code: '',
  name: '',
  observations: ''
}

const stateConst = {
  productDepartments: [],
  productDepartmentActive: productDepartmentModel,
  productDepartmentActiveOld: productDepartmentModel,
  nextProductDepartment: 0,
  previousProductDepartment: 0,
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_PRODUCT_DEPARTMENT_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_PRODUCT_DEPARTMENT_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'SET_NEXT_PREV_PRODUCT_DEPARTMENT':
    {
      return {
        ...state,
        nextProductDepartment: action.payload.next,
        previousProductDepartment: action.payload.previous
      }
    } // case

    case 'CLEAR_NEXT_PREV_PRODUCT_DEPARTMENT':
    {
      return {
        ...state,
        nextProductDepartment: 0,
        previousProductDepartment: 0
      }
    } // case

    case 'FETCH_PRODUCT_DEPARTMENTS_FULFILLED':
    {
      return {
        ...state,
        productDepartments: action.payload
      }

    } // case

    case 'FETCH_PRODUCT_DEPARTMENTS_REJECTED':
    {
      return {
        ...state,
        productDepartments: []
      }
    } // case

    case 'SET_PRODUCT_DEPARTMENT':
    {
      return {
        ...state,
        productDepartmentActive: action.payload
      }
    }

    case 'SET_PRODUCT_DEPARTMENT_OLD':
    {
      return {
        ...state,
        productDepartmentActiveOld: action.payload
      }
    }

    case 'CLEAR_PRODUCT_DEPARTMENT':
    {
      return {
        ...state,
        productDepartmentActive: productDepartmentModel,
        productDepartmentActiveOld: productDepartmentModel
      }
    }

  } // switch

  return state // default return

} // reducer
