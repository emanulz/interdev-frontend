const defaultPermissions = {
  add: 'unfetched',
  change: 'unfetched',
  list: 'unfetched',
  delete: 'unfetched'
}

const productModel = {
  id: '0000000000',
  code: '',
  description: '',
  short_description: '',
  unit: 'Unid',
  fractioned: true,
  department: '0000000000',
  subdepartment: '0000000000',
  barcode: '',
  internal_barcode: '',
  supplier_code: '',
  model: '',
  part_number: '',
  brand_code: '',
  inventory_enabled: true,
  inventory_minimum: 0,
  inventory_maximum: 0,
  inventory_negative: false,
  cost: 0,
  cost_based: true,
  utility1: 0,
  utility2: 0,
  utility3: 0,
  price: 0,
  price1: 0,
  price2: 0,
  price3: 0,
  sell_price: 0,
  sell_price1: 0,
  sell_price2: 0,
  sell_price3: 0,
  ask_price: false,
  use_taxes: false,
  taxes: 0,
  tax_code: '00',
  use_taxes2: false,
  taxes2: 0,
  tax_code2: '00',
  use_taxes3: false,
  taxes3: 0,
  tax_code3: '00',
  pred_discount: 0,
  is_active: true,
  consignment: false,
  generic: false,
  image: null,
  observations: '',
  on_sale: false,
  max_sale_discount: 0,
  max_regular_discount: 5,
  is_service: false,
  use_coin_round: true,
  is_used: false,
  factor_IVA: 1,
  rate_code_IVA: '08',
  tax_code_IVA: '01',
  taxes_IVA: 13
}

const stateConst = {
  products: [],
  productActive: productModel,
  productActiveOld: productModel,
  nextProduct: 0,
  previousProduct: 0,
  permissions: defaultPermissions,
  taxes: [],
  file: ''
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {
    case 'SET_IMAGE_FILE':
    {
      return {
        ...state,
        file: action.payload
      }
    }

    case 'CLEAR_IMAGE_FILE':
    {
      return {
        ...state,
        file: action.payload
      }
    }

    case 'FETCH_USER_PRODUCT_PERMISSIONS_FULLFILLED':
    {
      return {
        ...state,
        permissions: action.payload
      }
    } // case

    case 'FETCH_USER_PRODUCT_PERMISSIONS_REJECTED':
    {
      return {
        ...state,
        permissions: defaultPermissions
      }
    } // case

    case 'SET_NEXT_PREV_PRODUCT':
    {
      return {
        ...state,
        nextProduct: action.payload.next,
        previousProduct: action.payload.previous
      }
    } // case

    case 'CLEAR_NEXT_PREV_PRODUCT':
    {
      return {
        ...state,
        nextProduct: 0,
        previousProduct: 0
      }
    } // case

    case 'FETCH_PRODUCTS_FULFILLED':
    {
      return {
        ...state,
        products: action.payload
      }

    } // case

    case 'FETCH_PRODUCTS_REJECTED':
    {
      return {
        ...state,
        products: []
      }
    } // case

    case 'SET_PRODUCT':
    {
      return {
        ...state,
        productActive: action.payload
      }
    }

    case 'SET_PRODUCT_OLD':
    {
      return {
        ...state,
        productActiveOld: action.payload
      }
    }

    case 'CLEAR_PRODUCT':
    {
      return {
        ...state,
        productActive: productModel,
        productActiveOld: productModel
      }
    }

    case 'FETCH_TAXES_FULFILLED':
    {
      return {
        ...state,
        taxes: action.payload
      }

    } // case

    case 'FETCH_TAXES_REJECTED':
    {
      return {
        ...state,
        taxes: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
