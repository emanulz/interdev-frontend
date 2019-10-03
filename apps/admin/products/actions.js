// ------------------------------------------------------------------------------------------
// MODULE IMPORTS
// ------------------------------------------------------------------------------------------
import alertify from 'alertifyjs'

export function checkProductData(product, products) {
  let Ok = true

  if (product.name == '') {
    alertify.alert('Error', 'Debe especificar el nombre del Producto')
    return false
  }

  // UNIQUE FIELDS
  products.forEach((productData) => {
    if (product.code == productData.code) {
      if (product.id != productData.id) {
        alertify.alert('Error', `El Producto ${productData.code} - ${productData.description}, ya posee el código ${productData.code}`)
        Ok = false
        return false
      }
    }
  })

  return Ok
}

export function determinAmounts(product, fieldName, value, XMLVersion, usesSimpleUtility) {
  console.log('USES SIMPLE UTILITY determinAmounts:', usesSimpleUtility)
  switch (fieldName) {

    case 'sell_price1':
    {
      product = fromSellPrice(product, value, 'price1', 'utility1', XMLVersion, usesSimpleUtility)
      return product
    }
    case 'sell_price2':
    {
      product = fromSellPrice(product, value, 'price2', 'utility2', XMLVersion, usesSimpleUtility)
      return product
    }
    case 'sell_price3':
    {
      product = fromSellPrice(product, value, 'price3', 'utility3', XMLVersion, usesSimpleUtility)
      return product
    }

    case 'price1':
    {
      product = fromPrice(product, value, 'sell_price1', 'utility1', XMLVersion, usesSimpleUtility)
      return product
    }
    case 'price2':
    {
      product = fromPrice(product, value, 'sell_price2', 'utility2', XMLVersion, usesSimpleUtility)
      return product
    }
    case 'price3':
    {
      product = fromPrice(product, value, 'sell_price3', 'utility3', XMLVersion, usesSimpleUtility)
      return product
    }

    case 'cost':
    {
      product = fromCost(product, value, XMLVersion, usesSimpleUtility)
      return product
    }
    case 'cost_based':
    {
      product = fromCost(product, product.cost, XMLVersion, usesSimpleUtility)
      return product
    }
    case 'taxes':
    {
      product = taxesChanged(product, XMLVersion, usesSimpleUtility)
      return product
    }
    case 'taxes2':
    {
      product = taxesChanged(product, XMLVersion, usesSimpleUtility)
      return product
    }
    case 'taxes3':
    {
      product = taxesChanged(product, XMLVersion, usesSimpleUtility)
      return product
    }
    case 'use_taxes':
    {
      product = taxesChanged(product, XMLVersion, usesSimpleUtility)
      return product
    }
    case 'use_taxes2':
    {
      product = taxesChanged(product, XMLVersion, usesSimpleUtility)
      return product
    }
    case 'use_taxes3':
    {
      product = taxesChanged(product, XMLVersion, usesSimpleUtility)
      return product
    }
    case 'utility1':
    {
      product = fromUtility(product, value, 'price1', 'sell_price1', XMLVersion, usesSimpleUtility)
      return product
    }
    case 'utility2':
    {
      product = fromUtility(product, value, 'price2', 'sell_price2', XMLVersion, usesSimpleUtility)
      return product
    }
    case 'utility3':
    {
      product = fromUtility(product, value, 'price3', 'sell_price3', XMLVersion, usesSimpleUtility)
      return product
    }
    case 'tax_code_IVA':
    {
      product = taxesChanged(product, XMLVersion, usesSimpleUtility)
      return product
    }
    case 'rate_code_IVA':
    {
      product = taxesChanged(product, XMLVersion, usesSimpleUtility)
      return product
    }
    case 'factor_IVA':
    {
      product = taxesChanged(product, XMLVersion, usesSimpleUtility)
      return product
    }
    case 'taxes_IVA':
    {
      product = taxesChanged(product, XMLVersion, usesSimpleUtility)
      return product
    }
    case 'is_used':
    {
      console.log('HERRREEEEEE USED')
      product = taxesChanged(product, XMLVersion, usesSimpleUtility)
      return product
    }

  }

  return product
}

function fromSellPrice(product, value, priceField, utilityField, XMLVersion, usesSimpleUtility) {
  console.log('USES SIMPLE UTILITY fromSellPrice:', usesSimpleUtility)

  product.cost_based = false

  let iv1 = 0
  let iv2 = 0
  let iv3 = 0

  if (value) {
    // CHECK FOR NEW TAXES
    if (XMLVersion == '4.2' || XMLVersion == '') {
      iv1 = (product.use_taxes && product.taxes) ? parseFloat(product.taxes) / 100 : 0
      iv2 = (product.use_taxes2 && product.taxes2) ? parseFloat(product.taxes2) / 100 : 0
      iv3 = (product.use_taxes3 && product.taxes3) ? parseFloat(product.taxes3) / 100 : 0
    // XML 4.3
    } else if (XMLVersion == '4.3') {
      iv1 = (parseFloat(product.taxes_IVA) > 0)
        ? (product.taxes_IVA / 100)
        : 0
    // NOT FOUND
    } else {
      alertify.alert('ERROR', `No se pudo leer la version activa del formato XML, los impuestos no se sumaran, por lo que el total puede estar inválido. el valor leido es ${XMLVersion}`)
    }

    const price = parseFloat(value / (1 + iv1 + iv2 + iv3))

    product[priceField] = price.toFixed(2)

    // const utility = product.cost ? ((price / parseFloat(product.cost)) - 1) * 100 : 0
    let utilityU = 0
    if (usesSimpleUtility) {
      utilityU = product.cost ? ((price / parseFloat(product.cost)) - 1) * 100 : 0
    } else {
      utilityU = product.cost ? ((price - parseFloat(product.cost)) / price) * 100 : 0
    }

    product[utilityField] = utilityU.toFixed(2)
    return product

  } else {
    product[priceField] = 0
    product[utilityField] = 0
    return product
  }
}

function fromPrice(product, value, sellField, utilityField, XMLVersion, usesSimpleUtility) {
  console.log('USES SIMPLE UTILITY fromPrice:', usesSimpleUtility)
  value = parseFloat(value)
  product.cost_based = false

  let iv1 = 0
  let iv2 = 0
  let iv3 = 0
  if (value) {
    // CHECK FOR NEW TAXES
    if (XMLVersion == '4.2' || XMLVersion == '') {
      iv1 = (product.use_taxes && product.taxes) ? parseFloat(product.taxes) / 100 : 0
      iv2 = (product.use_taxes2 && product.taxes2) ? parseFloat(product.taxes2) / 100 : 0
      iv3 = (product.use_taxes3 && product.taxes3) ? parseFloat(product.taxes3) / 100 : 0

    } else if (XMLVersion == '4.3') {

      iv1 = (parseFloat(product.taxes_IVA) > 0)
        ? (product.taxes_IVA / 100)
        : 0
    // NOT FOUND
    } else {
      alertify.alert('ERROR', `No se pudo leer la version activa del formato XML, los impuestos no se sumaran, por lo que el total puede estar inválido. el valor leido es ${XMLVersion}`)
    }

    const sellPrice = (value * iv1) + (value * iv2) + (value * iv3) + value
    product[sellField] = sellPrice.toFixed(2)

    // const utility = product.cost ? ((value / parseFloat(product.cost)) - 1) * 100 : 0
    let utilityU = 0
    if (usesSimpleUtility) {
      utilityU = product.cost ? ((value / parseFloat(product.cost)) - 1) * 100 : 0
    } else {
      utilityU = product.cost ? ((value - parseFloat(product.cost)) / value) * 100 : 0
    }
    product[utilityField] = utilityU.toFixed(2)
    return product

  } else {
    product[sellField] = 0
    product[utilityField] = 0
    return product
  }
}

function fromCost(product, cost, XMLVersion, usesSimpleUtility) {
  console.log('USES SIMPLE UTILITY fromCost:', usesSimpleUtility)
  let iv1 = 0
  let iv2 = 0
  let iv3 = 0
  if (product.cost_based) { // IF PRICE DEPENDS ON COST
    // CHECK FOR NEW TAXES
    if (XMLVersion == '4.2' || XMLVersion == '') {
      iv1 = (product.use_taxes && product.taxes) ? parseFloat(product.taxes) / 100 : 0
      iv2 = (product.use_taxes2 && product.taxes2) ? parseFloat(product.taxes2) / 100 : 0
      iv3 = (product.use_taxes3 && product.taxes3) ? parseFloat(product.taxes3) / 100 : 0
    } else if (XMLVersion == '4.3') {
      iv1 = (parseFloat(product.taxes_IVA) > 0)
        ? (product.taxes_IVA / 100)
        : 0
    // NOT FOUND
    } else {
      alertify.alert('ERROR', `No se pudo leer la version activa del formato XML, los impuestos no se sumaran, por lo que el total puede estar inválido. el valor leido es ${XMLVersion}`)
    }
    // const price = cost && product.utility ? parseFloat(cost) * (1 + (parseFloat(product.utility) / 100)) : 0
    let priceU = 0
    if (usesSimpleUtility) {
      priceU = cost && product.utility1 ? parseFloat(cost) * (1 + (parseFloat(product.utility1) / 100)) : 0
    } else {
      priceU = cost && product.utility1 ? parseFloat(cost) / (1 - (parseFloat(product.utility1) / 100)) : 0
    }
    product['price1'] = priceU.toFixed(2)

    // const price2 = cost && product.utility2 ? parseFloat(cost) * (1 + (parseFloat(product.utility2) / 100)) : 0
    let priceU2 = 0
    if (usesSimpleUtility) {
      priceU2 = cost && product.utility2 ? parseFloat(cost) * (1 + (parseFloat(product.utility2) / 100)) : 0
    } else {
      priceU2 = cost && product.utility2 ? parseFloat(cost) / (1 - (parseFloat(product.utility2) / 100)) : 0
    }
    product['price2'] = priceU2.toFixed(2)

    // const price3 = cost && product.utility3 ? parseFloat(cost) * (1 + (parseFloat(product.utility3) / 100)) : 0
    let priceU3 = 0
    if (usesSimpleUtility) {
      priceU3 = cost && product.utility3 ? parseFloat(cost) * (1 + (parseFloat(product.utility3) / 100)) : 0
    } else {
      priceU3 = cost && product.utility3 ? parseFloat(cost) / (1 - (parseFloat(product.utility3) / 100)) : 0
    }
    product['price3'] = priceU3.toFixed(2)

    // const sellPrice = (price * iv1) + (price * iv2) + (price * iv3) + price
    const sellPriceU = (priceU * iv1) + (priceU * iv2) + (priceU * iv3) + priceU
    product['sell_price1'] = sellPriceU.toFixed(2)

    // const sellPrice2 = (price2 * iv1) + (price2 * iv2) + (price2 * iv3) + price2
    const sellPriceU2 = (priceU2 * iv1) + (priceU2 * iv2) + (priceU2 * iv3) + priceU2
    product['sell_price2'] = sellPriceU2 ? sellPriceU2.toFixed(2) : 0

    // const sellPrice3 = (price3 * iv1) + (price3 * iv2) + (price3 * iv3) + price3
    const sellPriceU3 = (priceU3 * iv1) + (priceU3 * iv2) + (priceU3 * iv3) + priceU3
    product['sell_price3'] = sellPriceU3 ? sellPriceU3.toFixed(2) : 0

    return product

  } else { // IF PRICE IS FIXED

    alertify.alert('ERROR DE CÁLCULO', 'FAVOR REPORTAR ESTE CASO QUE NO DEBERIA SUCEDER...')
    const utility = product.price1 && parseFloat(product.price1) > 0 ? ((parseFloat(product.price1) / parseFloat(cost)) - 1) * 100 : 0

    // if (!isNaN(utility) && isFinite(utility)) {
    //   product['utility1'] = utility.toFixed(2)
    // } else {
    //   product['utility1'] = 0
    // }
    product['utility1'] = utility.toFixed(2)

    const utility2 = product.price2 && parseFloat(product.price2) > 0 ? ((parseFloat(product.price2) / parseFloat(cost)) - 1) * 100 : 0
    // if (!isNaN(utility2 && isFinite(utility2))) {
    //   product['utility2'] = utility2.toFixed(2)
    // } else {
    //   product['utility2'] = 0
    // }
    product['utility2'] = utility2.toFixed(2)

    const utility3 = product.price3 && parseFloat(product.price3) > 0 ? ((parseFloat(product.price3) / parseFloat(cost)) - 1) * 100 : 0
    // if (!isNaN(utility3 && isFinite(utility3))) {
    //   product['utility3'] = utility3.toFixed(2)
    // } else {
    //   product['utility3'] = 0
    // }
    product['utility3'] = utility3.toFixed(2)

    return product
  }

}

function fromUtility(product, utility, priceField, sellPriceField, XMLVersion, usesSimpleUtility) {
  console.log('USES SIMPLE UTILITY fromUtility:', usesSimpleUtility)
  let iv1 = 0
  let iv2 = 0
  let iv3 = 0
  if (product.cost_based) {
    if (XMLVersion == '4.2' || XMLVersion == '') {
      iv1 = (product.use_taxes && product.taxes) ? parseFloat(product.taxes) / 100 : 0
      iv2 = (product.use_taxes2 && product.taxes2) ? parseFloat(product.taxes2) / 100 : 0
      iv3 = (product.use_taxes3 && product.taxes3) ? parseFloat(product.taxes3) / 100 : 0
    } else if (XMLVersion == '4.3') {
      iv1 = (parseFloat(product.taxes_IVA) > 0)
        ? (product.taxes_IVA / 100)
        : 0
    // NOT FOUND
    } else {
      alertify.alert('ERROR', `No se pudo leer la version activa del formato XML, los impuestos no se sumaran, por lo que el total puede estar inválido. el valor leido es ${XMLVersion}`)
    }
    // const price = product.cost && utility ? parseFloat(product.cost) * (1 + (parseFloat(utility) / 100)) : 0
    let priceU = 0
    if (usesSimpleUtility) {
      priceU = product.cost && utility ? parseFloat(product.cost) * (1 + (parseFloat(utility) / 100)) : 0
    } else {
      priceU = product.cost && utility ? parseFloat(product.cost) / (1 - (parseFloat(utility) / 100)) : 0
    }
    // const priceU = product.cost && utility ? parseFloat(product.cost) / (1 - (parseFloat(utility) / 100)) : 0
    product[priceField] = priceU.toFixed(2)

    // const sellPrice = (price * iv1) + (price * iv2) + (price * iv3) + price
    const sellPriceU = (priceU * iv1) + (priceU * iv2) + (priceU * iv3) + priceU
    product[sellPriceField] = sellPriceU.toFixed(2)

    return product
  }

  return product
}

function taxesChanged(product, XMLVersion) {
  console.log('XLM VERSION taxesChanged:', XMLVersion)
  if (product.cost_based) {
    product = fromCost(product, product.cost, XMLVersion)
    return product

  } else {
    product = fromPrice(product, product.price1, 'sell_price1', 'utility1', XMLVersion)
    product = fromPrice(product, product.price2, 'sell_price2', 'utility2', XMLVersion)
    product = fromPrice(product, product.price3, 'sell_price3', 'utility3', XMLVersion)

    return product
  }

}
