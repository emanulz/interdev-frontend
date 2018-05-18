const productModel = {
  id: '0000000000'
}

const stateConst = {
  products: [],
  productActive: productModel,
  inventoryMovements: []
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'FETCH_PRODUCTS_FULFILLED':
    {
      const products = action.payload
      products.forEach(product => {
        const inventoryByWarehouse = JSON.parse(product.inventory_by_warehouse)
        product.inventory_by_warehouse = inventoryByWarehouse
      })
      return {
        ...state,
        products: action.products
      }

    } // case

    case 'FETCH_PRODUCTS_REJECTED':
    {
      return {
        ...state,
        products: []
      }
    } // case

    case 'SET_PRODUCT':
    {
      const product = action.payload
      product.inventory_by_warehouse = JSON.parse(product.inventory_by_warehouse)
      return {
        ...state,
        productActive: product
      }
    } // case

    case 'CLEAR_PRODUCT':
    {
      return {
        ...state,
        productActive: productModel
      }
    } // case

    case 'FETCH_INVENTORY_MOVEMENTS_FULFILLED':
    {
      const movements = action.payload
      movements.forEach(movement => {
        const warehouse = JSON.parse(movement.warehouse)
        movement.warehouse = warehouse
      })
      return {
        ...state,
        inventoryMovements: movements
      }

    } // case

    case 'FETCH_INVENTORY_MOVEMENTS_REJECTED':
    {
      return {
        ...state,
        inventoryMovements: []
      }
    } // case

    case 'CLEAR_INVENTORY_MOVEMENTS':
    {
      return {
        ...state,
        inventoryMovements: []
      }
    } // case

  } // switch

  return state // default return

} // reducer
