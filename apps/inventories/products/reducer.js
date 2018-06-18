const stateConst = {
  products: [],
  productActive: '',
  departments: [],
  departmentActive: '',
  subdepartments: [],
  subdepartmentActive: '',
  productmovements: [],
  isPhysicalTake: false,
  filterText: ''
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    // ***********************************
    // PHYSICAL TAKE
    // ***********************************

    case 'TOGGLE_PHYSICAL_TAKE':
    {
      const physycalState = state.isPhysicalTake
      return {
        ...state,
        isPhysicalTake: !physycalState

      }
    } // case

    // ***********************************
    // PRODUCTS
    // ***********************************

    case 'FETCH_PRODUCTS_REJECTED':
    {
      return {
        ...state,
        products: []
      }
    } // case

    case 'FETCH_PRODUCTS_FULFILLED':
    {
      const products = action.payload
      products.forEach(product => {
        const inventoryByWarehouse = JSON.parse(product.inventory_existent)
        product.inventory_existent = inventoryByWarehouse
      })
      return {
        ...state,
        products: products
      }
    } // case

    case 'SET_PRODUCT':
    {
      return {
        ...state,
        productActive: action.payload
      }
    } // case

    case 'CLEAR_PRODUCT':
    {
      return {
        ...state,
        productActive: ''
      }
    } // case

    // ***********************************
    // FILTER
    // ***********************************

    case 'SET_FILTER_TEXT':
    {
      return {
        ...state,
        filterText: action.payload
      }
    } // case

    case 'CLEAR_FILTER_TEXT':
    {
      return {
        ...state,
        filterText: ''
      }
    } // case

    // ***********************************
    // DEPARTMENTS
    // ***********************************

    case 'FETCH_PRODUCT_DEPARTMENTS_FULFILLED':
    {
      return {
        ...state,
        departments: action.payload
      }

    } // case

    case 'FETCH_PRODUCT_DEPARTMENTS_REJECTED':
    {
      return {
        ...state,
        departments: []
      }
    } // case

    case 'SET_PRODUCT_DEPARTMENT':
    {
      return {
        ...state,
        departmentActive: action.payload
      }
    }

    case 'CLEAR_PRODUCT_DEPARTMENT':
    {
      return {
        ...state,
        departmentActive: ''
      }
    }

    // ***********************************
    // SUB DEPARTMENTS
    // ***********************************

    case 'FETCH_PRODUCT_SUBDEPARTMENTS_FULFILLED':
    {
      return {
        ...state,
        subdepartments: action.payload
      }

    } // case

    case 'FETCH_PRODUCT_SUBDEPARTMENTS_REJECTED':
    {
      return {
        ...state,
        subdepartments: []
      }
    } // case

    case 'SET_PRODUCT_SUBDEPARTMENT':
    {
      return {
        ...state,
        subdepartmentActive: action.payload
      }
    }

    case 'CLEAR_PRODUCT_SUBDEPARTMENT':
    {
      return {
        ...state,
        subdepartmentActive: ''
      }
    }

  } // switch

  return state // default return

} // reducer
