const stateConst = {
  isVisible: false,
  isFull: false,
  sale: {},
  presale: {},
  ticket: {},
  invoice: {},
  creditNotes: [],
  debitNotes: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SHOW_REPRINT_INVOICE_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_REPRINT_INVOICE_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'TOGGLE_REPRINT_INVOICE_PANEL':
    {
      const visibleOrNot = state.isVisible
      return {
        ...state,
        isVisible: visibleOrNot
      }
    } // case

    case 'TOGGLE_REPRINT_INVOICE_PANEL_FULL':
    {
      const fullOrNot = state.isFull
      return {
        ...state,
        isFull: !fullOrNot
      }
    } // case

    case 'SET_REPRINT_INVOICE_SALE':
    {
      const sale = action.payload
      try {
        sale.cart = JSON.parse(sale.cart)
        sale.user = JSON.parse(sale.user)
        sale.client = JSON.parse(sale.client)
        sale.pay = JSON.parse(sale.pay)
      } catch (err) { console.log(err) }
      return {
        ...state,
        sale: sale
      }
    } // case

    case 'CLEAR_REPRINT_INVOICE_SALE':
    {
      return {
        ...state,
        sale: {}
      }
    } // case

    case 'SET_REPRINT_INVOICE_PRESALE':
    {
      const presale = action.payload
      try {
        presale.cart = JSON.parse(presale.cart)
        presale.user = JSON.parse(presale.user)
        presale.client = JSON.parse(presale.client)
      } catch (err) { console.log(err) }
      return {
        ...state,
        presale: presale
      }
    } // case

    case 'CLEAR_REPRINT_INVOICE_PRESALE':
    {
      return {
        ...state,
        presale: {}
      }
    } // case

    case 'SET_REPRINT_INVOICE_TICKET':
    {
      return {
        ...state,
        ticket: action.payload
      }
    } // case

    case 'CLEAR_REPRINT_INVOICE_TICKET':
    {
      return {
        ...state,
        ticket: {}
      }
    } // case

    case 'SET_REPRINT_INVOICE_INVOICE':
    {
      return {
        ...state,
        invoice: action.payload
      }
    } // case

    case 'CLEAR_REPRINT_INVOICE_INVOICE':
    {
      return {
        ...state,
        invoice: {}
      }
    } // case

    case 'SET_REPRINT_INVOICE_CREDIT_NOTE':
    {
      return {
        ...state,
        creditNotes: action.payload
      }
    } // case

    case 'CLEAR_REPRINT_INVOICE_CREDIT_NOTES':
    {
      return {
        ...state,
        creditNotes: []
      }
    } // case

    case 'SET_REPRINT_INVOICE_DEBIT_NOTE':
    {
      return {
        ...state,
        debitNotes: action.payload
      }
    } // case

    case 'CLEAR_REPRINT_INVOICE_DEBIT_NOTES':
    {
      return {
        ...state,
        debitNotes: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
