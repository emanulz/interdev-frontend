import alertify from 'alertifyjs'
import axios from 'axios'
// ------------------------------------------------------------------------------------------
// CONFIG DEFAULT AXIOS
// ------------------------------------------------------------------------------------------

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
// ------------------------------------------------------------------------------------------
// EXPORT FUNCTIONS USED IN COMPONENTS
// ------------------------------------------------------------------------------------------

// This function updates totals the cart store item, generates new values according cart item objects, then push the to store
export function updateTotals(inCart, exempt, dontRound, XMLVersion) {
  console.log('XML VERSION updateTotals(CART ACTIONS FUNCTION): ', XMLVersion)

  let subtotal = 0
  let subTotalNoDiscount = 0
  let taxes = 0
  let total = 0
  let discountTotal = 0

  // for Each element adds the values to get totals
  inCart.forEach((item) => {

    subTotalNoDiscount = subTotalNoDiscount + item.subTotalNoDiscount

    subtotal = subtotal + item.subtotal
    const product = item.product
    const subTotal = item.subtotal
    let iv1 = 0
    let iv2 = 0
    let iv3 = 0
    // const taxesCalc = (item.product.use_taxes)
    //   ? item.subtotal * (item.product.taxes / 100)
    //   : 0

    // const taxesCalc2 = (item.product.use_taxes2)
    //   ? item.subtotal * (item.product.taxes2 / 100)
    //   : 0

    // const taxesCalc3 = (item.product.use_taxes3)
    //   ? item.subtotal * (item.product.taxes3 / 100)
    //   : 0

    // PREVIOUS VERSIONS USES OLD CODE
    if (XMLVersion == '4.2' || XMLVersion == '') {
      iv1 = (product.use_taxes)
        ? subTotal * (product.taxes / 100)
        : 0
      iv2 = (product.use_taxes2)
        ? subTotal * (product.taxes2 / 100)
        : 0
      iv3 = (product.use_taxes3)
        ? subTotal * (product.taxes3 / 100)
        : 0
    // XML 4.3
    } else if (XMLVersion == '4.3') {

      iv1 = (parseFloat(product.taxes_IVA) > 0)
        ? subTotal * (product.taxes_IVA / 100)
        : 0
    // NOT FOUND
    } else {
      alertify.alert('ERROR', `No se pudo leer la version activa del formato XML, los impuestos no se sumaran, por lo que el total puede estar inválido. el valor leido es ${XMLVersion}`)
    }

    // taxes = taxes + taxesCalc + taxesCalc2 + taxesCalc3
    taxes = taxes + iv1 + iv2 + iv3
    discountTotal = discountTotal + item.discountCurrency // this is the value in currency

  })
  // TODO Config for round or not
  // total = Math.round(subtotal + taxes)
  const exemptAmount = exempt ? taxes : 0
  total = exempt ? subtotal : subtotal + taxes
  // returs a dispatch with a payload of the obtained values

  const totalRounded = total
  // if (dontRound) {
  //   totalRounded = total
  // } else {
  //   totalRounded = Math.round((total / 5)) * 5
  // }

  return {
    type: 'UPDATE_CART_TOTALS',
    payload: {
      subtotal: subtotal,
      taxes: taxes,
      exemptAmount: exemptAmount,
      total: totalRounded,
      discountTotal: discountTotal,
      subTotalNoDiscount: subTotalNoDiscount,
      totalNotRounded: total,
      dontRound: dontRound
    }
  }
}

// Finds a code in the cart and sends a dispatch to remove it from cart based on index
export function removeFromCart(itemsInCart, code) {

  const indexInCart = itemsInCart.findIndex(item => item.uuid == code) // checks if product exists

  const res = (indexInCart == -1) // if not exists dispatch Not Found, if exists check if already in cart
    ? {
      type: 'PRODUCT_IN_CART_NOT_FOUND',
      payload: -1
    }
    : {
      type: 'REMOVE_FROM_CART',
      payload: indexInCart
    }

  return res
}

export function callDoomsdayCheck(resolve, reject) {
  axios.get('/api/administration/helpertasks/checkUpgrade/').then(function(response) {
    resolve(response.data)
  }).catch(function(error) {
    console.log(error)
    reject(error)
  }
  )
}
