/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import { setItem, getItemByIDDispatch } from '../../../../utils/api'
import Summary from './components/summary.jsx'
import Documents from './components/documents.jsx'
import Actions from './components/actions.jsx'
import Related from './components/relatedDocs.jsx'

@connect((store) => {
  return {
    permissions: store.etickets.permissions,
    document: store.documentDetail.activeDocument,
    relatedFetched: store.documentDetail.relatedFetched,
    relatedFetchig: store.documentDetail.relatedFetchig
  }
})
export default class Main extends React.Component {

  // componentWillMount() {
  //   const model = this.props.match.params.model
  //   const id = this.props.match.params.id

  //   const kwargs = this.determinKwargs(model, id)
  //   this.props.dispatch({type: 'CLEAR_DOCUMENT_DETAIL_RELATED', payload: ''})
  //   this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
  //   this.props.dispatch(setItem(kwargs))
  // }

  componentDidMount() {
    this.props.dispatch({type: 'CLEAR_ACTIVE_DOCUMENT', payload: ''})
    this.props.dispatch({type: 'CLEAR_DOCUMENT_DETAIL_RELATED', payload: ''})

    const model = this.props.match.params.model
    const id = this.props.match.params.id

    const kwargs = this.determinKwargs(model, id)
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(setItem(kwargs))
  }

  componentWillUnmount() {
    this.props.dispatch({type: 'CLEAR_ACTIVE_DOCUMENT', payload: ''})
    this.props.dispatch({type: 'CLEAR_DOCUMENT_DETAIL_RELATED', payload: ''})
  }

  componentDidUpdate() {
    // const model = this.props.match.params.model
    if (this.props.document.hasOwnProperty('id') && !this.props.relatedFetched && !this.props.relatedFetchig) {
      console.log('FETCH RELATED TRIGGERED---->', this.props.document)
      const model = this.props.match.params.model
      const modelId = this.determinModelID(model)
      this.props.dispatch({type: 'SET_DOCUMENT_DETAIL_RELATED_FETCHING', payload: ''})
      const kwarg = {
        lookUpField: 'consecutive_numbering',
        url: `/api/electronicticketcreate/getRelatedDocs/?doc_id=${this.props.document.id}&doc_type=${modelId}`,
        successType: 'FETCH_DOCUMENT_DETAIL_RELATED_FULFILLED',
        errorType: 'FETCH_DOCUMENT_DETAIL_RELATED_REJECTED'
      }

      this.props.dispatch(getItemByIDDispatch(kwarg))
    } else {
      console.log('FETCH RELATED NOT NEEDED---->', this.props.document)
    }
  }

  determinModelID(model) {
    switch (model) {
      case 'invoice':
      {
        return 'FE'
      }
      case 'ticket':
      {
        return 'TE'
      }
      case 'creditnote':
      {
        return 'NC'
      }
      case 'purchase':
      {
        return 'ND'
      }
    }
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
        return {
          lookUpField: 'consecutive_numbering',
          url: '/api/electroniccreditnote/',
          lookUpValue: id,
          dispatchType: 'FETCH_DOCUMENT_DETAIL_FULFILLED',
          dispatchErrorType: 'FETCH_DOCUMENT_DETAIL_REJECTED',
          lookUpName: 'Consecutivo',
          modelName: 'Nota de Crédito Electrónica',
          redirectUrl: '/admin/invoicing/creditnotes',
          history: this.props.history
        }
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
            <Summary modelText='FACTURA ELECTRÓNICA' model={this.props.match.params.model} />
            <Related />
            {/* <Documents model={this.props.match.params.model} /> */}
          </div>
          <div className='admin-invoicing-detail-body-second'>
            <Documents model={this.props.match.params.model} />
            <Actions />
            {/* <Related /> */}
          </div>
          <div className='admin-invoicing-detail-body-last'>
            {/* <Actions /> */}
          </div>
        </div>
      }
      case 'ticket':
      {
        return <div className='admin-invoicing-detail-body'>
          <div className='admin-invoicing-detail-body-first'>
            <Summary modelText='TIQUETE ELECTRÓNICO' model={this.props.match.params.model} />
            <Related />
            {/* <Documents model={this.props.match.params.model} /> */}
          </div>
          <div className='admin-invoicing-detail-body-second'>
            {/* <Related /> */}
            <Documents model={this.props.match.params.model} />
            <Actions />
          </div>
          <div className='admin-invoicing-detail-body-last'>
            {/* <Actions /> */}
          </div>
        </div>
      }
      case 'creditnote':
      {
        return <div className='admin-invoicing-detail-body'>
          <div className='admin-invoicing-detail-body-first'>
            <Summary modelText='NOTA DE CRÉDITO ELECTRÓNICA' model={this.props.match.params.model} />
            {/* <Documents model={this.props.match.params.model} /> */}
            <Related />
          </div>
          <div className='admin-invoicing-detail-body-second'>
            <Documents model={this.props.match.params.model} />
            <Actions />
            {/* <Related /> */}
          </div>
          <div className='admin-invoicing-detail-body-last'>
            {/* <Actions /> */}
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
