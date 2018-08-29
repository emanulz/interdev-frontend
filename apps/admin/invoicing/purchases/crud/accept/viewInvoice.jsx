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
      ? <div className='viewInvoice-buttons'>
        <button onClick={this.acceptInvoice.bind(this)} className='btn btn-success uploadButton'> ACEPTAR </button>
        <button onClick={this.rejectInvoice.bind(this)} className='btn btn-danger uploadButton'> RECHAZAR </button>
      </div>
      : <div />

    const cantBeAccepted = !this.props.loadedPurchase.can_be_accepted
      ? <div className='viewInvoice-cantBe'>
        <h1>
          ATENCION! El Elemento cargado no puede ser aceptado o rechazado.
        </h1>
        <h2>
          <b>Razón:</b> {item.reason}
        </h2>
      </div>
      : <div />

    const body = item.lineas.map(linea => {
      return <div key={linea.NumeroLinea} className='viewInvoice-body-item'>
        <div>
          {linea.Codigo}
        </div>
        <div>
          {linea.Detalle}
        </div>
        <div>
          {linea.PrecioUnitario}
        </div>
        <div>
          {linea.Cantidad}
        </div>
        <div>
          {linea.MontoTotal}
        </div>
      </div>
    })

    // ********************************************************************
    // RETURN BLOCK
    // ********************************************************************
    return <div className='col-xs-12 viewInvoice'>

      {cantBeAccepted}

      <div className='viewInvoice-header'>
        <h1>{item.header.DocType}</h1>
        <h2>Clave: {item.header.Clave}</h2>
        <h2>Fecha: {item.header.FechaEmision}</h2>
        <h2>Consecutivo: {item.header.NumeroConsecutivo}</h2>
      </div>

      <div className='viewInvoice-data'>
        <div className='viewInvoice-data-emitter'>
          <h1>EMISOR</h1>
          <h2>{item.emisor.Nombre}</h2>
          <h2>{item.header.Numero}</h2>
          <h2>{item.emisor.CorreoElectronico}</h2>
          <h2>{item.emisor.Telefono}</h2>
        </div>

        <div className='viewInvoice-data-receiver'>
          <h1>RECEPTOR</h1>
          <h2>{item.receptor.Nombre}</h2>
          <h2>identificación{item.receptor.Numero}</h2>
          <h2>{item.receptor.CorreoElectronico}</h2>
        </div>
      </div>

      <div className='viewInvoice-body'>
        <div className='viewInvoice-body-header'>
          <div>
            Código
          </div>
          <div>
            Detalle
          </div>
          <div>
            P.U
          </div>
          <div>
            Cantidad
          </div>
          <div>
            Total
          </div>
        </div>
        {body}
      </div>

      <div className='viewInvoice-totals'>
        <div className='viewInvoice-totals-table'>
          <h1>TOTALES</h1>
          <h2>Subtotal: {item.resumen.TotalVenta}</h2>
          <h2>Descuento: {item.resumen.TotalDescuentos}</h2>
          <h2>IV: {item.resumen.TotalGravado}</h2>
          <h2>Total: {item.resumen.TotalVentaNeta}</h2>
        </div>
      </div>

      {buttons}
      ****** Temp for testing *****
      <div className='viewInvoice-buttons'>
        <button onClick={this.acceptInvoice.bind(this)} className='btn btn-success uploadButton'> ACEPTAR </button>
        <button onClick={this.rejectInvoice.bind(this)} className='btn btn-danger uploadButton'> RECHAZAR </button>
      </div>

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form)
