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
    senders: store.senders.senders
  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch({type: 'CLEAR_SENDER', payload: ''})

    const senderKwargs = {
      url: '/api/senders',
      successType: 'FETCH_SENDERS_FULFILLED',
      errorType: 'FETCH_SENDERS_REJECTED'
    }

    this.props.dispatch(getItemDispatch(senderKwargs))

  }

  render() {

    const headerOrder = [
      {
        field: 'id_number',
        text: 'Identificación',
        type: 'primary'
      }, {
        field: 'name',
        text: 'Nombre'
      }, {
        field: 'commercial_name',
        text: 'Nombre comercial'
      }, {
        field: 'email',
        text: 'Email'
      }
    ]

    const fetching = <div />
    const list = <DataTable headerOrder={headerOrder} model='senders' data={this.props.senders}
      addLink='/admin/senders/add' idField='id' />

    const content = this.props.fetching ? fetching : list

    return <div className='list list-container'>
      <h1>Listado de Emisores:</h1>
      {content}
    </div>

  }

}
