import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import {acceptEPurchase} from '../../actions.js'

@connect((store) => {
  return {
    purchaseToUpload: store.epurchases.purchaseToUpload,
    loadedPurchase: store.epurchases.loadedPurchase
  }
})

class Form extends React.Component {
  // REACT METHODS

  fieldFocus(ev) {
    ev.target.select()
  }

  acceptInvoice() {
    const formData = new FormData()
    formData.append('file', this.props.purchaseToUpload)
    formData.append('taxpayer_response', 'ACCEPTED')
    const kwargs = {
      url: '/api/facturareception/processHaciendaXML/',
      item: formData,
      sucessMessage: 'Proceso de aceptación iniciado correctamente.',
      errorMessage: 'Hubo un error al aceptar la compra, intente de nuevo.'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(acceptEPurchase(kwargs))
  }

  rejectInvoice() {
    const formData = new FormData()
    formData.append('file', this.props.purchaseToUpload)
    formData.append('taxpayer_response', 'REJECTED')
    const kwargs = {
      url: '/api/facturareception/processHaciendaXML/',
      item: formData,
      sucessMessage: 'Proceso de rechazo iniciado correctamente.',
      errorMessage: 'Hubo un error al rechazar la compra, intente de nuevo.'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(acceptEPurchase(kwargs))
  }

  render() {

    const item = this.props.loadedPurchase
    const buttons = this.props.loadedPurchase.can_be_accepted
      ? <div>
        <button onClick={this.acceptInvoice.bind(this)} className='btn btn-primary uploadButton'> ACEPTAR </button>
        <button onClick={this.rejectInvoice.bind(this)} className='btn btn-primary uploadButton'> RECHAZAR </button>
      </div>
      : <div>
        <h1>
          El Elemento cargado no puede ser aceptado o rechazado.
        </h1>
        <h2>
          Razón: {item.reason}
        </h2>

      </div>

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 viewInvoice'>

      <div className='viewInvoice-header'>
        <h1>DATOS</h1>
        <h2>Clave: {item.header.Clave}</h2>
        <h2>Fecha: {item.header.FechaEmision}</h2>
        <h2>Consecutivo: {item.header.NumeroConsecutivo}</h2>
      </div>

      <div className='viewInvoice-emitter'>
        <h1>EMISOR</h1>
        <h2>Nombre: {item.emisor.Nombre}</h2>
        <h2>Email: {item.emisor.CorreoElectronico}</h2>
        <h2>Identificación: {item.header.Numero}</h2>
      </div>

      <div className='viewInvoice-receiver'>
        <h1>RECEPTOR</h1>
        <h2>Nombre: {item.receptor.Nombre}</h2>
        <h2>Email: {item.receptor.CorreoElectronico}</h2>
        <h2>Identificación: {item.receptor.Numero}</h2>
      </div>

      <div className='viewInvoice-totals'>
        <h1>RESUMEN</h1>
        <h2>Subtotal: {item.resumen.Nombre}</h2>
        <h2>Descuento: {item.resumen.TotalDescuentos}</h2>
        <h2>IV: {item.resumen.TotalGravado}</h2>
        <h2>Total: {item.resumen.TotalVenta}</h2>
      </div>

      {buttons}
      <button onClick={this.acceptInvoice.bind(this)} className='btn btn-primary uploadButton'> ACEPTAR </button>
      <button onClick={this.rejectInvoice.bind(this)} className='btn btn-primary uploadButton'> RECHAZAR </button>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form)
