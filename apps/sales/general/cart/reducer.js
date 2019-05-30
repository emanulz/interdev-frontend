const stateConst = {
  editable: true,
  created: '',
  updated: '',
  isNull: false,
  cartHasItems: false, // var to check if cart has items
  cartItems: [], // the list of items in cart
  cartSubtotalNoDiscount: 0, // subtotal without discount and taxes
  cartSubtotal: 0, // the subtotal including discounts without taxes
  cartTaxes: 0, // total amount of taxes in cart in currency
  cartExemptAmount: 0, // total amount of exempt in cart in currency
  cartTotal: 0, // cart total after discount and taxes
  globalDiscount: 0, // discount %
  discountTotal: 0, // discount in currency
  cartItemActive: false,
  totalNotRounded: 0,
  exemptionDocument: '',
  isExempt: false,
  needsRecalc: false,
  otherCharges: [] // the other charges array
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'CLEAR_ALL':
    {
      return {
        ...state,
        editable: true,
        created: '',
        updated: '',
        isNull: false,
        cartHasItems: false, // var to check if cart has items
        cartItems: [], // the list of items in cart
        cartSubtotalNoDiscount: 0, // subtotal without discount and taxes
        cartSubtotal: 0, // the subtotal including discounts without taxes
        cartTaxes: 0, // total amount of taxes in cart in currency
        cartExemptAmount: 0, // total amount of taxes in cart in currency
        cartTotal: 0, // cart total after discount and taxes
        globalDiscount: 0, // discount %
        discountTotal: 0, // discount in currency
        cartItemActive: false,
        totalNotRounded: 0,
        otherCharges: []
      }
    }

    case 'CLEAR_CART':
    {
      return {
        ...state,
        editable: true,
        created: '',
        updated: '',
        isNull: false,
        cartHasItems: false, // var to check if cart has items
        cartItems: [], // the list of items in cart
        cartSubtotalNoDiscount: 0, // subtotal without discount and taxes
        cartSubtotal: 0, // the subtotal including discounts without taxes
        cartTaxes: 0, // total amount of taxes in cart in currency
        cartExemptAmount: 0, // total amount of taxes in cart in currency
        cartTotal: 0, // cart total after discount and taxes
        globalDiscount: 0, // discount %
        discountTotal: 0, // discount in currency
        cartItemActive: false,
        totalNotRounded: 0,
        otherCharges: []
      }
    }

    case 'ADD_TO_CART':
    {
      // ADD THE EXEMPTION AMOUNT BASED ON THE CURRENT STATUS
      const item = action.payload
      item['exempt_percentage'] = state.isExempt ? 100 : 0
      return {
        ...state,
        cartHasItems: true,
        cartItems: [
          // action.payload,
          ...state.cartItems,
          item
        ]
      }
    } // case

    case 'REMOVE_FROM_CART':
    {

      const newCart = [...state.cartItems]

      newCart.splice(action.payload, 1)

      const itemsLeftInCart = (newCart.length > 0)
      // ? true
      // : false

      return {
        ...state,
        cartHasItems: itemsLeftInCart,
        cartItems: newCart
      }
    } // case

    case 'UPDATE_CART':
    {

      const newCart = [...state.cartItems]
      newCart[action.payload.index] = action.payload.item
      newCart[action.payload.index]['exempt_percentage'] = state.isExempt ? 100 : 0
      return {
        ...state,
        cartItems: newCart
      }
    } // case

    case 'UPDATE_CART_ITEM_LOTE':
    {

      const newCart = [...state.cartItems]
      newCart[action.payload.index]['lote'] = action.payload.lote
      newCart[action.payload.index]['exempt_percentage'] = state.isExempt ? 100 : 0
      return {
        ...state,
        cartItems: newCart
      }
    } // case

    case 'UPDATE_CART_TOTALS':
    {

      return {
        ...state,
        cartSubtotal: action.payload.subtotal,
        cartTaxes: action.payload.taxes,
        cartExemptAmount: action.payload.exemptAmount,
        cartTotal: action.payload.total,
        discountTotal: action.payload.discountTotal,
        cartSubtotalNoDiscount: action.payload.subTotalNoDiscount,
        totalNotRounded: action.payload.totalNotRounded
      }
    } // case

    case 'SET_GLOBAL_DISCOUNT':
    {

      return {
        ...state,
        globalDiscount: action.payload
      }
    } // case

    case 'REPLACE_CART':
    {
      return {
        ...state,
        cartItems: action.payload
      }
    }

    case 'UPDATE_LINE_DISCOUNT':
    {
      const newCart = [...state.cartItems]
      newCart[action.payload.index].discount = action.payload.value

      return {
        ...state,
        cartItems: newCart
      }
    }

    case 'SET_SALE_EXEMPT':
    {
      const cartItems = [...state.cartItems]
      const newCartItems = cartItems.map(item => {
        item['exempt_percentage'] = 100
        return item
      })
      return {
        ...state,
        isExempt: true,
        cartItems: newCartItems
      }
    }

    case 'CLEAR_SALE_EXEMPT':
    {
      const cartItems = [...state.cartItems]
      const newCartItems = cartItems.map(item => {
        item['exempt_percentage'] = 0
        return item
      })
      return {
        ...state,
        isExempt: false,
        cartItems: newCartItems
      }
    }

    case 'NEW_SALE':
    {
      state = stateConst
      return {
        ...state, stateConst
      }
    } // case

    case 'LOADED_SALE':
    {
      return {
        ...state,
        created: action.payload.cart.created,
        isNull: action.payload.cart.isNull,
        cartHasItems: action.payload.cart.cartHasItems, // var to check if cart has items
        cartItems: action.payload.cart.cartItems, // the list of items in cart
        cartSubtotalNoDiscount: action.payload.cart.cartSubtotalNoDiscount, // subtotal without discount and taxes
        cartSubtotal: action.payload.cart.cartSubtotal, // the subtotal including discounts without taxes
        cartTaxes: action.payload.cart.cartTaxes, // total amount of taxes in cart in currency
        cartTotal: action.payload.cart.cartTotal, // cart total after discount and taxes
        globalDiscount: action.payload.cart.globalDiscount, // discount %
        discountTotal: action.payload.cart.discountTotal, // discount in currency
        totalNotRounded: action.payload.cart.totalNotRounded,
        otherCharges: action.payload.cart.otherCharges ? action.payload.cart.otherCharges : []
      }
    }

    case 'LOADED_PROFORMA':
    {
      return {
        ...state,
        created: action.payload.cart.created,
        isNull: action.payload.cart.isNull,
        cartHasItems: action.payload.cart.cartHasItems, // var to check if cart has items
        cartItems: action.payload.cart.cartItems, // the list of items in cart
        cartSubtotalNoDiscount: action.payload.cart.cartSubtotalNoDiscount, // subtotal without discount and taxes
        cartSubtotal: action.payload.cart.cartSubtotal, // the subtotal including discounts without taxes
        cartTaxes: action.payload.cart.cartTaxes, // total amount of taxes in cart in currency
        cartTotal: action.payload.cart.cartTotal, // cart total after discount and taxes
        globalDiscount: action.payload.cart.globalDiscount, // discount %
        discountTotal: action.payload.cart.discountTotal, // discount in currency
        totalNotNotRounded: action.payload.cart.totalNotNotRounded,
        otherCharges: action.payload.cart.otherCharges ? action.payload.cart.otherCharges : []
      }
    }

    case 'LOADED_PRESALE':
    {
      return {
        ...state,
        created: action.payload.cart.created,
        isNull: action.payload.cart.isNull,
        cartHasItems: action.payload.cart.cartHasItems, // var to check if cart has items
        cartItems: action.payload.cart.cartItems, // the list of items in cart
        cartSubtotalNoDiscount: action.payload.cart.cartSubtotalNoDiscount, // subtotal without discount and taxes
        cartSubtotal: action.payload.cart.cartSubtotal, // the subtotal including discounts without taxes
        cartTaxes: action.payload.cart.cartTaxes, // total amount of taxes in cart in currency
        cartTotal: action.payload.cart.cartTotal, // cart total after discount and taxes
        globalDiscount: action.payload.cart.globalDiscount, // discount %
        discountTotal: action.payload.cart.discountTotal, // discount in currency
        totalNotRounded: action.payload.cart.totalNotRounded,
        otherCharges: action.payload.cart.otherCharges ? action.payload.cart.otherCharges : []
      }
    }

    case 'LOAD_CART':
    {
      return {
        ...state,
        isNull: action.payload.isNull,
        cartHasItems: action.payload.cartHasItems, // var to check if cart has items
        cartItems: action.payload.cartItems, // the list of items in cart
        cartSubtotalNoDiscount: action.payload.cartSubtotalNoDiscount, // subtotal without discount and taxes
        cartSubtotal: action.payload.cartSubtotal, // the subtotal including discounts without taxes
        cartTaxes: action.payload.cartTaxes, // total amount of taxes in cart in currency
        cartTotal: action.payload.cartTotal, // cart total after discount and taxes
        globalDiscount: action.payload.globalDiscount, // discount %
        discountTotal: action.payload.discountTotal, // discount in currency
        totalNotRounded: action.payload.totalNotRounded,
        otherCharges: action.payload.otherCharges ? action.payload.otherCharges : []
      }
    }

    case 'SET_PRODUCT_ACTIVE_IN_CART':
    {
      return {
        ...state,
        cartItemActive: action.payload
      }
    } // case

    case 'SET_MASS_PRICES_DATA':
    {
      const data = action.payload
      const items = [...state.cartItems]
      if (data.constructor === Array) {
        data.forEach(element => {
          const index = items.findIndex((item) => item.product.id == element.product.id)
          console.log('DATA INDEX IN MASS', index)
          if (index != -1) {
            items[index].pricesData = element
            delete items[index].pricesData['product']
          }
        })
      } else {
        const index = items.findIndex((item) => item.product.id == data.product.id)
        if (index != -1) {
          items[index].pricesData = data
          delete items[index].pricesData['product']
        }
      }

      return {
        ...state,
        cartItems: items,
        needsRecalc: true
      }
    } // case

    case 'SET_CART_NEEDS_RECALC':
    {
      return {
        ...state,
        needsRecalc: action.payload
      }
    }

    case 'ADD_OTHER_CHARGE':
    {
      const item = action.payload
      return {
        ...state,
        otherCharges: [
          // action.payload,
          ...state.otherCharges,
          item
        ]
      }
    }

  } // switch

  return state // default return

} // reducer
