const stateConst = {
  editable: true,
  created: '',
  updated: '',
  isNull: false,
  cartHasItems: false, // var to check if cart has items
  cartItems: [], // the list of items in cart
  cartSubtotal: 0, // the subtotal including discounts without taxes
  cartTaxes: 0, // total amount of taxes in cart in currency
  cartTotal: 0, // cart total after discount and taxes
  discountTotal: 0, // discount in currency
  cartItemActive: false,
  orderTransport: 0 //the amount of transport invoiced
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SET_TRANSPORT_AMOUNT':
    {
      return {
        ...state,
        orderTransport: action.payload
      }
    }
    case 'SET_DISCOUNT_AMOUNT':
    {
      return {
        ...state,
        discountTotal: action.payload
      }
    }

    case 'SET_TAXES_AMOUNT':
    {
      return {
        ...state,
        cartTaxes: action.payload
      }
    }
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
        cartTotal: 0, // cart total after discount and taxes
        globalDiscount: 0, // discount %
        discountTotal: 0, // discount in currency
        cartItemActive: false,
      }
    }
    case 'CLEAR_PURCHASE':
    {
      return{
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
        cartTotal: 0, // cart total after discount and taxes
        globalDiscount: 0, // discount %
        discountTotal: 0, // discount in currency
        cartItemActive: false,
      }
    }
    case 'LOADED_PURCHASE':
    {
      const cart = JSON.parse(action.payload.cart)
      return {
        ...state,
        editable:cart.editable,
        created:cart.created,
        updated:cart.updated,
        isNull: cart.isNull,
        cartHasItems: cart.cartHasItems,
        cartItems: cart.cartItems,
        cartSubtotal: cart.cartSubtotal,
        cartTaxes: cart.cartTaxes,
        cartTotal: cart.cartTotal,
        discountTotal: cart.discountTotal,
        cartItemActive: cart.cartItemActive,
        orderTransport:cart.orderTransport?cart.orderTransport:0,
      }
    }

    case 'ADD_TO_CART':
    {

      return {
        ...state,
        cartHasItems: true,
        cartItems: [
          ...state.cartItems,
          action.payload
        ]
      }
    } // case

    case 'REMOVE_FROM_CART':
    {

      const newCart = [...state.cartItems]

      newCart.splice(action.payload, 1)

      const itemsLeftInCart = (newCart.length > 0)

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
        cartTotal: action.payload.total,
        discountTotal: action.payload.discountTotal,
      }
    } // case

    case 'REPLACE_CART':
    {
      return {
        ...state,
        cartItems: action.payload
      }
    }

    case 'SET_PRODUCT_ACTIVE_IN_CART':
    {
      return {
        ...state,
        cartItemActive: action.payload
      }
    } // case

  } // switch

  return state // default return

} // reducer
