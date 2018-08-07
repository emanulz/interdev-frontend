const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const productSubDepartmentModel = {
  id: '0000000000',
  name: '',
  observations: '',
  identifier: ''
}

const stateConst = {
  productSubDepartments: [],
  productSubDepartmentActive: productSubDepartmentModel,
  productSubDepartmentActiveOld: productSubDepartmentModel,
  nextproductSubDepartment: 0,
  previousproductSubDepartment: 0,
  permissions: defaultPermissions
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_USER_PRODUCT_SUBDEPARTMENT_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_PRODUCT_SUBDEPARTMENT_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'SET_NEXT_PREV_PRODUCT_SUBDEPARTMENT':
    {
      return {
        ...state,
        nextproductSubDepartment: action.payload.next,
        previousproductSubDepartment: action.payload.previous
      }
    } // case

    case 'CLEAR_NEXT_PREV_PRODUCT_SUBDEPARTMENT':
    {
      return {
        ...state,
        nextProductSubDepartment: 0,
        previousProductSubDepartment: 0
      }
    } // case

    case 'FETCH_PRODUCT_SUBDEPARTMENTS_FULFILLED':
    {
      return {
        ...state,
        productSubDepartments: action.payload
      }

    } // case

    case 'FETCH_PRODUCT_SUBDEPARTMENTS_REJECTED':
    {
      return {
        ...state,
        productSubDepartments: []
      }
    } // case

    case 'SET_PRODUCT_SUBDEPARTMENT':
    {
      return {
        ...state,
        productSubDepartmentActive: action.payload
      }
    }

    case 'SET_PRODUCT_SUBDEPARTMENT_OLD':
    {
      return {
        ...state,
        productSubDepartmentActiveOld: action.payload
      }
    }

    case 'CLEAR_PRODUCT_SUBDEPARTMENT':
    {
      return {
        ...state,
        productSubDepartmentActive: productSubDepartmentModel,
        productSubDepartmentActiveOld: productSubDepartmentModel
      }
    }

  } // switch

  return state // default return

} // reducer
