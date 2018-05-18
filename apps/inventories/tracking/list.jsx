/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {getItemDispatch} from '../../../utils/api'

// components
import DataTable from '../../../general/dataTable/dataTable.jsx'

@connect((store) => {
  return {
    products: store.products.products
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'TRACKING_PANEL_MOUNTED', payload: ''})
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_PRODUCT', payload: ''})

    const productKwargs = {
      url: '/api/products',
      successType: 'FETCH_PRODUCTS_FULFILLED',
      errorType: 'FETCH_PRODUCTS_REJECTED'
    }

    this.props.dispatch(getItemDispatch(productKwargs))

  }

  // Render the product
  render() {
    const products = this.props.products

    const dataFiltered = products.filter(el => el.inventory_enabled)

    const headerOrder = [
      {
        field: 'code',
        text: 'Código',
        type: 'primaryNoEdit'
      }, {
        field: 'description',
        text: 'Descripción',
        type: 'text'
      }, {
        field: 'inventory',
        text: 'Existencia Total',
        type: 'text'
      },
      {
        field: 'code',
        text: 'Histórico',
        textToRender: 'Ver Histórico',
        type: 'textLink'
      }
    ]

    const list = <DataTable headerOrder={headerOrder} model='tracking' data={dataFiltered} app='inventories'
      addLink='' idField='id' />
    const fetching = <div />

    const content = this.props.fetching ? fetching : list

    return <div className='list list-container'>
      <h1>Listado de Productos:</h1>
      {content}
    </div>

  }
}
