const stateConst = {
  returnHasItems: false, // var to check if return has items
  returnItems: [], // the list of items in return
  returnSubtotal: 0, // the subtotal including discounts without taxes
  returnTaxes: 0, // total amount of taxes in return in currency
  returnTotal: 0, // return total after discount and taxes
  returnItemActive: false,
  totalNotRounded: 0
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'ADD_TO_RETURN':
    {

      return {
        ...state,
        returnHasItems: true,
        returnItems: [
          // action.payload,
          ...state.returnItems,
          action.payload
        ]
      }
    } // case

    case 'REMOVE_FROM_RETURN':
    {

      const newReturn = [...state.returnItems]

      newReturn.splice(action.payload, 1)

      const itemsLeftInReturn = (newReturn.length > 0)
      // ? true
      // : false

      return {
        ...state,
        returnHasItems: itemsLeftInReturn,
        returnItems: newReturn
      }
    } // case

    case 'UPDATE_RETURN':
    {

      const newReturn = [...state.returnItems]
      newReturn[action.payload.index] = action.payload.item

      return {
        ...state,
        returnItems: newReturn
      }
    } // case

    case 'UPDATE_RETURN_TOTALS':
    {

      return {
        ...state,
        returnSubtotal: action.payload.subtotal,
        returnTaxes: action.payload.taxes,
        returnTotal: action.payload.total,
        totalNotRounded: action.payload.totalNotRounded
      }
    } // case

    case 'REPLACE_RETURN':
    {
      return {
        ...state,
        returnItems: action.payload
      }
    }

    case 'NEW_SALE':
    {
      state = stateConst
      return {
        ...state, stateConst
      }
    } // case

    case 'SET_PRODUCT_ACTIVE_IN_RETURN':
    {
      return {
        ...state,
        returnItemActive: action.payload
      }
    } // case

  } // switch

  return state // default return

} // reducer
