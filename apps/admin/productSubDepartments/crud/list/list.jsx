/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import DataTable from '../../../../general/dataTable/dataTable.jsx'
import { getItemDispatch } from '../../../../utils/api.js'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    productSubDepartments: store.productSubDepartments.productSubDepartments
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_PRODUCT_SUBDEPARTMENT', payload: ''})

    const productSubDepartmentKwargs = {
      url: '/api/productsubdepartments',
      successType: 'FETCH_PRODUCT_SUBDEPARTMENTS_FULFILLED',
      errorType: 'FETCH_PRODUCT_SUBDEPARTMENTS_REJECTED'
    }

    this.props.dispatch(getItemDispatch(productSubDepartmentKwargs))

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
    const list = <DataTable headerOrder={headerOrder} model='productsubdepartments' data={this.props.productSubDepartments}
      addLink='/admin/productsubdepartments/add' idField='id' />

    const content = this.props.fetching ? fetching : list

    return <div className='list list-container'>
      <h1>Listado de Sub Familias de Producto:</h1>
      {content}
    </div>

  }

}
