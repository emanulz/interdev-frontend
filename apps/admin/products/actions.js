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

export function determinAmounts(product, fieldName, value) {
  switch (fieldName) {

    case 'sell_price':
    {
      product = fromSellPrice(product, value, 'price', 'utility')
      return product
    }
    case 'sell_price2':
    {
      product = fromSellPrice(product, value, 'price2', 'utility2')
      return product
    }
    case 'sell_price3':
    {
      product = fromSellPrice(product, value, 'price3', 'utility3')
      return product
    }

    case 'price':
    {
      product = fromPrice(product, value, 'sell_price', 'utility')
      return product
    }
    case 'price2':
    {
      product = fromPrice(product, value, 'sell_price2', 'utility2')
      return product
    }
    case 'price3':
    {
      product = fromPrice(product, value, 'sell_price3', 'utility3')
      return product
    }

    case 'cost':
    {
      product = fromCost(product, value)
      return product
    }
    case 'cost_based':
    {
      product = fromCost(product, product.cost)
      return product
    }
    case 'taxes':
    {
      product = taxesChanged(product)
      return product
    }
    case 'taxes2':
    {
      product = taxesChanged(product)
      return product
    }
    case 'taxes3':
    {
      product = taxesChanged(product)
      return product
    }
    case 'use_taxes':
    {
      product = taxesChanged(product)
      return product
    }
    case 'use_taxes2':
    {
      product = taxesChanged(product)
      return product
    }
    case 'use_taxes3':
    {
      product = taxesChanged(product)
      return product
    }
    case 'utility':
    {
      product = fromUtility(product, value, 'price', 'sell_price')
      return product
    }
    case 'utility2':
    {
      product = fromUtility(product, value, 'price2', 'sell_price2')
      return product
    }
    case 'utility3':
    {
      product = fromUtility(product, value, 'price3', 'sell_price3')
      return product
    }

  }

  return product
}

function fromSellPrice(product, value, priceField, utilityField) {

  product.cost_based = false

  if (value) {
    const iv1 = (product.use_taxes && product.taxes) ? parseFloat(product.taxes) / 100 : 0
    const iv2 = (product.use_taxes2 && product.taxes2) ? parseFloat(product.taxes2) / 100 : 0
    const iv3 = (product.use_taxes3 && product.taxes3) ? parseFloat(product.taxes3) / 100 : 0

    const price = parseFloat(value / (1 + iv1 + iv2 + iv3))

    product[priceField] = price.toFixed(2)

    // const utility = product.cost ? ((price / parseFloat(product.cost)) - 1) * 100 : 0
    const utilityU = product.cost ? ((price - parseFloat(product.cost)) / price) * 100 : 0

    product[utilityField] = utilityU.toFixed(2)
    return product

  } else {
    product[priceField] = 0
    product[utilityField] = 0
    return product
  }
}

function fromPrice(product, value, sellField, utilityField) {

  value = parseFloat(value)
  product.cost_based = false

  if (value) {
    const iv1 = (product.use_taxes && product.taxes) ? parseFloat(product.taxes) / 100 : 0
    const iv2 = (product.use_taxes2 && product.taxes2) ? parseFloat(product.taxes2) / 100 : 0
    const iv3 = (product.use_taxes3 && product.taxes3) ? parseFloat(product.taxes3) / 100 : 0

    const sellPrice = (value * iv1) + (value * iv2) + (value * iv3) + value
    product[sellField] = sellPrice.toFixed(2)

    // const utility = product.cost ? ((value / parseFloat(product.cost)) - 1) * 100 : 0
    const utilityU = product.cost ? ((value - parseFloat(product.cost)) / value) * 100 : 0
    product[utilityField] = utilityU.toFixed(2)
    return product

  } else {
    product[sellField] = 0
    product[utilityField] = 0
    return product
  }
}

function fromCost(product, cost) {

  if (product.cost_based) { // IF PRICE DEPENDS ON COST
    const iv1 = (product.use_taxes && product.taxes) ? parseFloat(product.taxes) / 100 : 0
    const iv2 = (product.use_taxes2 && product.taxes2) ? parseFloat(product.taxes2) / 100 : 0
    const iv3 = (product.use_taxes3 && product.taxes3) ? parseFloat(product.taxes3) / 100 : 0

    // const price = cost && product.utility ? parseFloat(cost) * (1 + (parseFloat(product.utility) / 100)) : 0
    const priceU = cost && product.utility ? parseFloat(cost) / (1 - (parseFloat(product.utility) / 100)) : 0
    product['price'] = priceU.toFixed(2)

    // const price2 = cost && product.utility2 ? parseFloat(cost) * (1 + (parseFloat(product.utility2) / 100)) : 0
    const priceU2 = cost && product.utility2 ? parseFloat(cost) / (1 - (parseFloat(product.utility2) / 100)) : 0
    product['price2'] = priceU2.toFixed(2)

    // const price3 = cost && product.utility3 ? parseFloat(cost) * (1 + (parseFloat(product.utility3) / 100)) : 0
    const priceU3 = cost && product.utility3 ? parseFloat(cost) / (1 - (parseFloat(product.utility3) / 100)) : 0
    product['price3'] = priceU3.toFixed(2)

    // const sellPrice = (price * iv1) + (price * iv2) + (price * iv3) + price
    const sellPriceU = (priceU * iv1) + (priceU * iv2) + (priceU * iv3) + priceU
    product['sell_price'] = sellPriceU.toFixed(2)

    // const sellPrice2 = (price2 * iv1) + (price2 * iv2) + (price2 * iv3) + price2
    const sellPriceU2 = (priceU2 * iv1) + (priceU2 * iv2) + (priceU2 * iv3) + priceU2
    product['sell_price2'] = sellPriceU2 ? sellPriceU2.toFixed(2) : 0

    // const sellPrice3 = (price3 * iv1) + (price3 * iv2) + (price3 * iv3) + price3
    const sellPriceU3 = (priceU3 * iv1) + (priceU3 * iv2) + (priceU3 * iv3) + priceU3
    product['sell_price3'] = sellPriceU3 ? sellPriceU3.toFixed(2) : 0

    return product

  } else { // IF PRICE IS FIXED
    const utility = product.price ? ((parseFloat(product.price) / parseFloat(cost)) - 1) * 100 : 0
    product['utility'] = utility.toFixed(2)

    const utility2 = product.price2 ? ((parseFloat(product.price2) / parseFloat(cost)) - 1) * 100 : 0
    product['utility2'] = utility2.toFixed(2)

    const utility3 = product.price3 ? ((parseFloat(product.price3) / parseFloat(cost)) - 1) * 100 : 0
    product['utility3'] = utility3.toFixed(2)

    return product
  }

}

function fromUtility(product, utility, priceField, sellPriceField) {
  if (product.cost_based) {
    console.log('FIELD', priceField)
    console.log('UTILITY', utility)
    const iv1 = (product.use_taxes && product.taxes) ? parseFloat(product.taxes) / 100 : 0
    const iv2 = (product.use_taxes2 && product.taxes2) ? parseFloat(product.taxes2) / 100 : 0
    const iv3 = (product.use_taxes3 && product.taxes3) ? parseFloat(product.taxes3) / 100 : 0

    // const price = product.cost && utility ? parseFloat(product.cost) * (1 + (parseFloat(utility) / 100)) : 0
    const priceU = product.cost && utility ? parseFloat(product.cost) / (1 - (parseFloat(utility) / 100)) : 0
    product[priceField] = priceU.toFixed(2)

    // const sellPrice = (price * iv1) + (price * iv2) + (price * iv3) + price
    const sellPriceU = (priceU * iv1) + (priceU * iv2) + (priceU * iv3) + priceU
    product[sellPriceField] = sellPriceU.toFixed(2)

    return product
  }

  return product
}

function taxesChanged(product) {

  if (product.cost_based) {
    product = fromCost(product, product.cost)
    return product

  } else {
    product = fromPrice(product, product.price, 'sell_price', 'utility')
    product = fromPrice(product, product.price2, 'sell_price2', 'utility2')
    product = fromPrice(product, product.price3, 'sell_price3', 'utility3')

    return product
  }

}
