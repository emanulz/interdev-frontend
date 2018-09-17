/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {getItemDispatch} from '../../../utils/api.js'
import AdminTable from '../../../general/adminTable/adminTable.jsx'

@connect((store) => {
  return {
    actions: store.actions.actionList
  }
})
export default class Actions extends React.Component {

  componentWillMount() {
    this.props.dispatch({type: 'PRESALE_PANEL_MOUNTED', payload: ''})
    const actionsKwargs = {
      url: '/api/restaurantserviceorderactions/?limit=200',
      successType: 'FETCH_ACTIONS_FULFILLED',
      errorType: 'FETCH_ACTIONS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(actionsKwargs))
  }

  // Main Layout
  render() {

    const headerOrder = [
      {
        field: 'table_name',
        text: 'Mesa'
      }, {
        field: 'client_name',
        text: 'Cliente'
      }, {
        field: 'product_description',
        text: 'Producto'
      }, {
        field: 'qty',
        text: 'Cantidad'
      }, {
        field: 'created',
        text: 'Creado',
        type: 'date'
      }
    ]

    const tableData = this.props.actions.length ? this.props.actions : []

    return <div className='actions'>
      <AdminTable headerOrder={headerOrder} model='actions' data={tableData}
        idField='id' />
    </div>

  }

}
