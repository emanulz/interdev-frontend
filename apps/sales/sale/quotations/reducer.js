
const stateConst = {
  quotations: [],
  isVisible: false,
  quotationId: '',
  quotationUser: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {
    case 'SET_QUOTATION_ID':
    {
      return {
        ...state,
        quotationId: action.payload
      }
    } // case

    case 'CLEAR_QUOTATION_ID':
    {
      return {
        ...state,
        quotationId: ''
      }
    } // case

    case 'SET_QUOTATION_USER':
    {
      return {
        ...state,
        quotationUser: action.payload
      }
    } // case

    case 'CLEAR_QUOTATION_USER':
    {
      return {
        ...state,
        quotationUser: {}
      }
    } // case

    case 'SHOW_QUOTATIONS_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_QUOTATIONS_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'FETCH_QUOTATIONS_REJECTED':
    {
      return {
        ...state,
        quotations: []
      }
    } // case

    case 'FETCH_QUOTATIONS_FULFILLED':
    {
      const quotations = action.payload.map(quotation => {
        return {
          ...quotation,
          cart: JSON.parse(quotation.cart),
          client: JSON.parse(quotation.client),
          user: JSON.parse(quotation.user)
        }
      })
      return {
        ...state,
        quotations: quotations
      }
    } // case

  } // switch

  return state // default return

} // reducer
