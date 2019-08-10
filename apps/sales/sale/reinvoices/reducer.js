
const stateConst = {
  reinvoices: [],
  isVisible: false,
  reinvoiceId: '',
  reinvoiceUser: {}
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {
    case 'SET_REINVOICE_ID':
    {
      return {
        ...state,
        reinvoiceId: action.payload
      }
    } // case

    case 'CLEAR_REINVOICE_ID':
    {
      return {
        ...state,
        reinvoiceId: ''
      }
    } // case

    case 'SET_REINVOICE_USER':
    {
      return {
        ...state,
        reinvoiceUser: action.payload
      }
    } // case

    case 'CLEAR_REINVOICE_USER':
    {
      return {
        ...state,
        reinvoiceUser: {}
      }
    } // case

    case 'SHOW_REINVOICES_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_REINVOICES_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'FETCH_REINVOICES_REJECTED':
    {
      return {
        ...state,
        reinvoices: []
      }
    } // case

    case 'FETCH_REINVOICES_FULFILLED':
    {
      const reinvoices = action.payload.map(reinvoice => {
        return {
          ...reinvoice,
          cart: JSON.parse(reinvoice.cart),
          client: JSON.parse(reinvoice.client),
          user: JSON.parse(reinvoice.user)
        }
      })
      return {
        ...state,
        reinvoices: reinvoices
      }
    } // case

  } // switch

  return state // default return

} // reducer
