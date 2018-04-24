/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import DataTable from '../../../../../general/dataTable/dataTable.jsx'
import { getItemDispatch } from '../../../../../utils/api.js'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    productDepartments: store.productDepartments.productDepartments
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_PRODUCT_DEPARTMENT', payload: ''})

    const productDepartmentKwargs = {
      url: '/api/productdepartments',
      successType: 'FETCH_PRODUCT_DEPARTMENTS_FULFILLED',
      errorType: 'FETCH_PRODUCT_DEPARTMENTS_REJECTED'
    }

    this.props.dispatch(getItemDispatch(productDepartmentKwargs))

  }

  render() {

    const headerOrder = [
      {
        field: 'code',
        text: 'Código',
        type: 'primary'
      }, {
        field: 'name',
        text: 'Nombre'
      }
    ]

    const fetching = <div />
    const list = <DataTable headerOrder={headerOrder} model='productDepartments' data={this.props.productDepartments}
      addLink='/admin/productdepartments/add' idField='id' />

    const content = this.props.fetching ? fetching : list

    return <div className='list list-container'>
      <h1>Listado de Familias de Producto:</h1>
      {content}
    </div>

  }

}
