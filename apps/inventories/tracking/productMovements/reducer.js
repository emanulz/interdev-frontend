const productModel = {
  id: '0000000000',
  inventory_existent: {}
}

const stateConst = {
  products: [],
  productActive: productModel,
  inventoryMovements: [],
  next: null,
  previous: null
}

export default function reducer(state = stateConst, action) {

  switch (action.type) {

    case 'SET_INVENTORY_MOVEMENTS_PREV_NEXT':
    {
      return {
        ...state,
        next: action.payload.next,
        previous: action.payload.previous
      }
    }

    case 'SET_PRODUCT_TRACKING':
    {
      const product = action.payload
      product.inventory_existent = JSON.parse(product.inventory_existent)
      return {
        ...state,
        productActive: product
      }
    } // case

    case 'CLEAR_PRODUCT_TRACKING':
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
        try {
          const warehouse = JSON.parse(movement.warehouse)
          movement.warehouse = warehouse
        } catch (err) {
          console.log(err)
        }
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
