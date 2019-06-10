/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import { setItem } from '../../../../utils/api'
import Summary from './components/summary.jsx'
import Documents from './components/documents.jsx'
import Actions from './components/actions.jsx'
import Related from './components/relatedDocs.jsx'

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

  compo

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
        return {
          lookUpField: 'consecutive_numbering',
          url: '/api/electronicticket/',
          lookUpValue: id,
          dispatchType: 'FETCH_DOCUMENT_DETAIL_FULFILLED',
          dispatchErrorType: 'FETCH_DOCUMENT_DETAIL_REJECTED',
          lookUpName: 'Consecutivo',
          modelName: 'Tiquete Electrónico',
          redirectUrl: '/admin/invoicing/tickets',
          history: this.props.history
        }
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

  determinBody(model) {

    switch (model) {
      case 'invoice':
      {
        return <div className='admin-invoicing-detail-body'>
          <div className='admin-invoicing-detail-body-first'>
            <Summary modelText='FACTURA ELECTRÓNICA' />
            <Documents model={this.props.match.params.model} />
          </div>
          <div className='admin-invoicing-detail-body-second'>
            <Actions />
          </div>
          <div className='admin-invoicing-detail-body-last'>
            <Related />
          </div>
        </div>
      }
      case 'ticket':
      {
        return <div className='admin-invoicing-detail-body'>
          <div className='admin-invoicing-detail-body-first'>
            <Summary modelText='TIQUETE ELECTRÓNICO' />
            <Documents model={this.props.match.params.model} />
          </div>
          <div className='admin-invoicing-detail-body-second'>
            <Actions />
          </div>
          <div className='admin-invoicing-detail-body-last'>
            <Related />
          </div>
        </div>
      }
      case 'creditnote':
      {
        return <div className='admin-invoicing-detail-body'>
          <div className='admin-invoicing-detail-body-first'>
            <Summary modelText='NOTA DE CRÉDITO ELECTRÓNICA' />
            <Documents model={this.props.match.params.model} />
          </div>
          <div className='admin-invoicing-detail-body-second'>
            <Actions />
          </div>
          <div className='admin-invoicing-detail-body-last'>
            <Related />
          </div>
        </div>
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
    const body = this.determinBody(model)

    return <div id={id} className='admin-invoicing-detail'>
      <h1>DETALLES DEL DOCUMENTO ELECTRÓNICO #{id}</h1>
      {body}
    </div>

  }

}
