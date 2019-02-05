

const stateConst = {
    //properties of the global purchase
    invoiceNumber:'',
    invoiceDate:'',
    usesMultiprice: true,

    //properties of the purchase cart
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
    orderTransport: 0, //the amount of transport invoiced
    discount_mode: 'money_based',
    do_global_price_calc: false

}


export default function reducer(state=stateConst, action) {
    switch (action.type) {
        case 'FORCE_GLOBAL_UTILITY_RECALC':
        {
            return{
                ...state,
                do_global_price_calc: !state.do_global_price_calc
            }
        }
        case 'SET_PRODUCT_ACTIVE_IN_CART':
        {
            return {
                ...state,
                cartItemActive: action.payload
            }
        }

        case 'UPDATE_PRODUCT_PRICING_DATA':
        {
            return {
                ...state,
                

            }
        }

    }

    return state
}