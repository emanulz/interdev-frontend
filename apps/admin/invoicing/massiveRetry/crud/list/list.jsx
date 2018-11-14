/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import {generalSave} from '../../../../../../utils/api.js'

@connect((store) => {
  return {
    fething: store.fetching.fetching,
    retryStatus: store.massiveRetry.retryStatus,
    retryDocType: store.massiveRetry.retryDocType,
    amount: store.massiveRetry.amount

  }
})
export default class List extends React.Component {

  componentWillMount() {

    this.props.dispatch({type: 'CLEAR_MASSIVE_RETRY', payload: ''})
  }

  setRetryStatus(ev) {
    const value = ev.target.value
    this.props.dispatch({type: 'SET_MASSIVE_RETRY_STATUS', payload: value})
  }

  setRetryDocType(ev) {
    const value = ev.target.value
    this.props.dispatch({type: 'SET_MASSIVE_RETRY_DOC_TYPE', payload: value})
  }

  setRetryAmount(ev) {
    const value = ev.target.value
    this.props.dispatch({type: 'SET_MASSIVE_RETRY_AMOUNT', payload: value})
  }

  retryDocuments() {

    const retry_kwargs = {
      url: '/api/facturareception/mass_retry/',
      method: 'post',
      data: {
        retryStatus: this.props.retryStatus,
        retryDocType: this.props.retryDocType,
        amount: this.props.amount
      },
      sucessMessage: 'Éxito despachando reintentos.',
      errorMessage: 'Error reintentando documentos.',
      successType: 'NONE',
      errorType: 'NONE'

    }
    this.props.dispatch(
      generalSave(retry_kwargs)
    )
    //prepare a post t
  }

  render() {

    return <div className='col-xs-12 row form-container'>
      <div className='col-xs-12 col-sm-4 fields-container first'>
        <span>REINTENTO DE FACTURAS MASIVO</span>
        <hr />
        <div className='form-group'>
          <label>Tipo de Documento</label>
          <select onChange={this.setRetryDocType.bind(this)} className='form-control'
            value={this.props.retryDocType} >
            <option value='1'>1 - Factura Electrónica</option>
            <option value='2'>2 - Nota de Crédito Electrónica</option>
            <option value='3'>3 - Nota de Débito Electrónica</option>
            <option value='4'>4 - Tiquete Electrónica</option>
            <option value='5'>5 - Compras Electrónicas</option>
          </select>
        </div>
        <div className='form-group'>
          <label>Estado a Reintentar</label>
          <select onChange={this.setRetryStatus.bind(this)} className='form-control'
            value={this.props.retryStatus} >
            <option value='0'>0 - Generando XML</option>
            <option value='1'>1 - XML Generado</option>
            <option value='2'>2 - XML Firmado</option>
            <option value='3'>3 - Enviado a Hacienda</option>
            <option value='4'>4 - Aceptada</option>
            <option value='5'>5 - Rechazada</option>
            <option value='6'>6 - Almacenada</option>
            <option value='7'>7 - PDF Creado</option>
            <option value='8'>8 - Email Enviado</option>
          </select>
        </div>

        <div className='form-group'>
          <label>Cantidad</label>
          <input value={this.props.amount} onChange={this.setRetryAmount.bind(this)} type='text'
            className='form-control' />
        </div>
        <div className='form-group'>
          <button onClick={this.retryDocuments.bind(this)} className='form-control btn btn-success'>Reintentar</button>
        </div>
      </div>
    </div>

  }

}
