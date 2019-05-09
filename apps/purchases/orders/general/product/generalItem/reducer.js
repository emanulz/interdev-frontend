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
  is_service: false
}

const stateConst = {
  isVisible: false,
  product: productModel,
  qty: 1
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

  } // switch

  return state // default return

} // reducer
