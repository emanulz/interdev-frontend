const productModel = {
  description: '',
  short_description: '',
  unit: 'Unid',
  cost: 0,
  cost_based: true,
  utility: 0,
  utility2: 0,
  utility3: 0,
  price: 0,
  price2: 0,
  price3: 0,
  sell_price: 0,
  sell_price2: 0,
  sell_price3: 0,
  use_taxes: false,
  taxes: 0,
  taxes_code: '00',
  is_service: false,
  is_used: false,
  factor_IVA: 1,
  rate_code_IVA: '08',
  tax_code_IVA: '01',
  taxes_IVA: 13
}

const stateConst = {
  isVisible: false,
  product: productModel,
  qty: 1,
  IVARates: [],
  IVACodes: [],
  IVAFactors: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'TOGGLE_GENERAL_ITEM_PANEL':
    {
      const visibleOrNot = state.isVisible
      return {
        ...state,
        isVisible: !visibleOrNot
      }
    } // case

    case 'HIDE_GENERAL_ITEM_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'SHOW_GENERAL_ITEM_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'SET_GENERAL_ITEM_PRODUCT':
    {
      return {
        ...state,
        product: action.payload
      }
    } // case

    case 'CLEAR_GENERAL_ITEM_PRODUCT':
    {
      return {
        ...state,
        product: productModel,
        qty: 1
      }
    } // case

    case 'SET_GENERAL_ITEM_QTY':
    {
      return {
        ...state,
        qty: action.payload
      }
    } // case

    case 'FETCH_IVA_CODES_FULFILLED':
    {
      return {
        ...state,
        IVACodes: action.payload
      }

    } // case

    case 'FETCH_IVA_CODES_REJECTED':
    {
      return {
        ...state,
        IVACodes: []
      }
    } // case

    case 'FETCH_IVA_RATES_FULFILLED':
    {
      return {
        ...state,
        IVARates: action.payload
      }

    } // case

    case 'FETCH_IVA_RATES_REJECTED':
    {
      return {
        ...state,
        IVARates: []
      }
    } // case

    case 'FETCH_IVA_FACTORS_FULFILLED':
    {
      return {
        ...state,
        IVAFactors: action.payload
      }

    } // case

    case 'FETCH_IVA_FACTORS_REJECTED':
    {
      return {
        ...state,
        IVAFactors: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
