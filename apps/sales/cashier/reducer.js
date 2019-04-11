import {getTotalAmount} from './content/actions.js'

const stateConst = {
  fullWidth: false,
  moneyBills: [],
  openBillList: [],
  openTotalCRC: 0,
  openTotalUSD: 0,
  closureTotalCRC: 0,
  closureTotalUSD: 0,
  byNotes: true, // if true the opening totals will be obtained from the notes qty
  openTotalCRCSetted: false,
  openTotalUSDSetted: false,
  closureTotalCRCSetted: false,
  closureTotalUSDSetted: false,
  closureCardTotalCRC: 0,
  closureTransferTotalCRC: 0

}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'TOGGLE_CASHIER_FULL_WIDTH':
    {
      const width = !state.fullWidth
      return {
        ...state,
        fullWidth: width
      }
    } // case

    case 'FETCH_MONEY_BILLS_FULFILLED':
    {
      return {
        ...state,
        moneyBills: action.payload
      }
    } // case

    case 'FETCH_MONEY_BILLS_REJECTED':
    {
      return {
        ...state,
        moneyBills: []
      }
    } // case

    case 'CLEAR_OPEN_BILLS_LIST':
    {
      return {
        ...state,
        openBillList: [],
        byNotes: false
      }
    }

    case 'ADD_TO_OPEN_BILLS_LIST':
    {
      const newLine = action.payload
      let existentOpenBillList = [...state.openBillList]
      // REMOVE THE ALREADY EXISTENT ITEM IN CART WITH SAME ID
      existentOpenBillList = existentOpenBillList.filter(item => {
        return item.value !== newLine.value
      })
      let settedCRC = state.openTotalCRCSetted
      let settedUSD = state.openTotalUSDSetted
      let settedClosureCRC = state.closureTotalCRCSetted
      let settedClosureUSD = state.closureTotalUSDSetted

      if (newLine.currency_code == 'CRC') {
        settedCRC = false
        settedClosureCRC = false
      }
      if (newLine.currency_code == 'USD') {
        settedUSD = false
        settedClosureUSD = false
      }
      // ADD IT TO CART
      existentOpenBillList.push(newLine)
      // RETURN

      return {
        ...state,
        openBillList: existentOpenBillList,
        openTotalUSDSetted: settedUSD,
        openTotalCRCSetted: settedCRC,
        closureTotalCRCSetted: settedClosureCRC,
        closureTotalUSDSetted: settedClosureUSD,
        openTotalCRC: getTotalAmount(existentOpenBillList, 'CRC'),
        openTotalUSD: getTotalAmount(existentOpenBillList, 'USD')
      }
    } // case

    case 'SET_TOTAL_CRC':
    {
      return {
        ...state,
        openTotalCRCSetted: true,
        openTotalCRC: action.payload
      }
    } // case

    case 'SET_TOTAL_USD':
    {
      return {
        ...state,
        openTotalUSDSetted: true,
        openTotalUSD: action.payload
      }
    } // case

    case 'SET_CLOSURE_TOTAL_CRC':
    {
      return {
        ...state,
        closureTotalCRCSetted: true,
        closureTotalCRC: action.payload
      }
    } // case

    case 'SET_CLOSURE_TOTAL_USD':
    {
      return {
        ...state,
        closureTotalUSDSetted: true,
        closureTotalUSD: action.payload
      }
    } // case

    case 'SET_CLOSURE_CARD_TOTAL_CRC':
    {
      return {
        ...state,
        closureCardTotalCRC: action.payload
      }
    } // case

    case 'SET_CLOSURE_TRANSFER_TOTAL_CRC':
    {
      return {
        ...state,
        closureTransferTotalCRC: action.payload
      }
    } // case

  } // switch

  return state // default return

} // reducer
