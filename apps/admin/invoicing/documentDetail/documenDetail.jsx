/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import { setItem } from '../../../../utils/api'
import SaleSummary from './components/saleSummary.jsx'

@connect((store) => {
  return {
    permissions: store.etickets.permissions
  }
})
export default class Main extends React.Component {

  componentWillMount() {
    const model = this.props.match.params.model
    const id = this.props.match.params.id

    const kwargs = this.determinKwargs(model, id)

    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(setItem(kwargs))
  }

  determinKwargs(model, id) {

    switch (model) {
      case 'invoice':
      {
        return {
          lookUpField: 'consecutive_numbering',
          url: '/api/electronicinvoice/',
          lookUpValue: id,
          dispatchType: 'FETCH_DOCUMENT_DETAIL_FULFILLED',
          dispatchErrorType: 'FETCH_DOCUMENT_DETAIL_REJECTED',
          lookUpName: 'Consecutivo',
          modelName: 'Factura Electrónica',
          redirectUrl: '/admin/invoicing/invoices',
          history: this.props.history
        }
      }
      case 'ticket':
      {
        break
      }
      case 'creditnote':
      {
        break
      }
      case 'purchase':
      {
        break
      }
    }

  }

  determinSummary(model) {

    switch (model) {
      case 'invoice':
      {
        return <SaleSummary modelText='FACTURA ELECTRÓNICA' />
      }
      case 'ticket':
      {
        break
      }
      case 'creditnote':
      {
        break
      }
      case 'purchase':
      {
        break
      }
    }

  }

  // Main Layout
  render() {
    const model = this.props.match.params.model
    const id = this.props.match.params.id
    const summary = this.determinSummary(model)

    return <div id={id} className='admin-invoicing-detail'>
      <h1>DETALLES DEL DOCUMENTO ELECTRÓNICO #{id}</h1>
      <div className='admin-invoicing-detail-body'>
        {summary}
      </div>
    </div>

  }

}
