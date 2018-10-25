
const stateConst = {
  isVisible: false,
  exemptionData: {
    documentType: '03',
    documentNumber: '',
    institutionName: '',
    documentDate: '',
    exemptAmount: 0,
    salePercent: 1
  },
  isExempt: false
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SHOW_EXEMPTION_PANEL':
    {
      return {
        ...state,
        isVisible: true
      }
    } // case

    case 'HIDE_EXEMPTION_PANEL':
    {
      return {
        ...state,
        isVisible: false
      }
    } // case

    case 'SET_EXEMPTION_DATA':
    {
      return {
        ...state,
        exemptionData: action.payload
      }
    } // case

    case 'CLEAR_EXEMPTION_DATA':
    {
      return {
        ...state,
        isExempt: {
          documentType: '',
          documentNumber: '',
          institutionName: '',
          documentDate: '',
          taxAmount: 0,
          salePercent: 100
        }
      }
    } // case

    case 'SET_SALE_EXEMPT':
    {
      return {
        ...state,
        isExempt: true
      }
    } // case

    case 'CLEAR_SALE_EXEMPT':
    {
      return {
        ...state,
        isExempt: false
      }
    } // case

  } // switch

  return state // default return

} // reducer
