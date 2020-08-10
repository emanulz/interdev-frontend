import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import {acceptEPurchase} from '../../actions.js'
import alertify from 'alertifyjs'
import { getItemDispatch } from '../../../../../../utils/api.js'


@connect((store) => {
  return {
    purchaseToUpload: store.epurchases.purchaseToUpload,
    loadedPurchase: store.epurchases.loadedPurchase,
    epurchaseType: store.epurchases.epurchaseType,
    token: store.epurchases.token,
    activities: store.epurchases.activities,
    target_activity: store.epurchases.target_activity
  }
})

class Form extends React.Component {



  componentWillMount(){
    const kwargs = {
      url: '/api/taxpayerlocalsro/',
      successType: 'TAX_PAYER_LOCAL_ACTIVITIES_FULFILLED',
      errorType: 'TAX_PAYER_LOCAL_ACTIVITIES_REJECTED'
    }
    this.props.dispatch(getItemDispatch(kwargs))
  }

  // REACT METHODS
  fieldFocus(ev) {
    ev.target.select()
  }

  acceptInvoice() {
    const formData = new FormData()
    formData.append('file', this.props.purchaseToUpload)
    formData.append('taxpayer_response', 'ACCEPTED')
    formData.append('purchase_type', this.props.epurchaseType)
    formData.append('token', this.props.token)
    formData.append('activity', this.props.target_activity)
    const kwargs = {
      url: '/api/facturareception/processHaciendaXML/',
      item: formData,
      sucessMessage: 'Proceso de aceptación iniciado correctamente.',
      errorMessage: 'Hubo un error al aceptar la compra, intente de nuevo.'
    }
    // ALERTIFY CONFIRM
    const _this = this
    alertify.confirm('Aceptar', `¿Desea aceptar esta factura ante hacienda? Esta acción no se puede deshacer.`, function() {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(acceptEPurchase(kwargs))
    }, function() {
      return true
    }).set('labels', {
      ok: 'Aceptar',
      cancel: 'Cancelar'
    })
  }

  rejectInvoice() {
    const formData = new FormData()
    formData.append('file', this.props.purchaseToUpload)
    formData.append('taxpayer_response', 'REJECTED')
    formData.append('token', this.props.token)
    const _this = this
    alertify.prompt('Rechazar', 'Ingrese la razón del rechazo', '',
      function(evt, value) {
        formData.append('reject_reason', value)
        for (const val of formData.values()) {
          console.log(val)
        }
        if (!value.length) {
          alertify.alert('ERROR', 'Debe especificar una razón de rechazo.')
          return true
        }
        if (value.length <= 79) {
          const kwargs = {
            url: '/api/facturareception/processHaciendaXML/',
            item: formData,
            sucessMessage: 'Proceso de rechazo iniciado correctamente.',
            errorMessage: 'Hubo un error al rechazar la compra, intente de nuevo.'
          }
          _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
          _this.props.dispatch(acceptEPurchase(kwargs))
        } else {
          alertify.alert('ERROR', 'La razón del rechazo debe ser menor a 80 caracteres.')
        }

      }, function() { return true })
  }

  setEpurchaseType(ev) {
    const value = ev.target.value
    this.props.dispatch({type: 'SET_EPURCHASE_TYPE', payload: value})
  }

  setTargetActivity(ev){
    const value = ev.target.value;
    this.props.dispatch({type: 'TAX_PAYER_ACTIVITY_SELECTED', payload: value});
  }

  render() {
    const activity_options = this.props.activities.map(
      a => {
        const name =  `${a.code}-${a.activity_name}`
        return <option value={a.id}>{name}</option>
      }
    );


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
        <div className='viewInvoice-body-item-code'>
          {linea.Codigo}
        </div>
        <div className='viewInvoice-body-item-detail'>
          {linea.Detalle}
        </div>
        <div className='viewInvoice-body-item-price'>
          {linea.PrecioUnitario}
        </div>
        <div className='viewInvoice-body-item-qty'>
          {linea.Cantidad}
        </div>
        <div className='viewInvoice-body-item-total'>
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
      <div className='viewInvoice-type'>
        <h1>Tipo de Factura:</h1>
        <select onChange={this.setEpurchaseType.bind(this)} className='form-control'
          value={this.props.epurchaseType} >
          <option value='PURCHASE'>Compra</option>
          <option value='EXPENSE'>Gasto</option>
        </select>
      </div>
      <div className='viewInvoice-activity'>
        <h1>Actividad económica:</h1>
        <select onChange={this.setTargetActivity.bind(this)} className='form-control'
          value={this.props.target_activity} >
          {activity_options}
        </select>
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
          <div className='viewInvoice-body-header-code'>
            Código
          </div>
          <div className='viewInvoice-body-header-detail'>
            Detalle
          </div>
          <div className='viewInvoice-body-header-price'>
            P.U
          </div>
          <div className='viewInvoice-body-header-qty'>
            Cantidad
          </div>
          <div className='viewInvoice-body-header-total'>
            Total
          </div>
        </div>
        {body}
      </div>

      <div className='viewInvoice-totals'>
        <div className='viewInvoice-totals-table'>
          <h1>TOTALES</h1>
          <h2><span>Moneda:</span> {item.resumen.CodigoMoneda}</h2>
          <h2>Tipo de Cambio: {item.resumen.TipoCambio}</h2>
          <h2>Subtotal Exento: {item.resumen.TotalExento}</h2>
          <h2>Subtotal Gravado: {item.resumen.TotalGravado}</h2>
          <h2>Descuento: {item.resumen.TotalDescuentos}</h2>
          <h2>IV: {item.resumen.TotalImpuesto}</h2>
          <h2>Total: {item.resumen.TotalComprobante}</h2>
        </div>
      </div>

      {buttons}
      {/* ****** Temp for testing *****
      <div className='viewInvoice-buttons'>
        <button onClick={this.acceptInvoice.bind(this)} className='btn btn-success uploadButton'> ACEPTAR </button>
        <button onClick={this.rejectInvoice.bind(this)} className='btn btn-danger uploadButton'> RECHAZAR </button>
      </div> */}

    </div>
  }
}

// EXPORT THE CLASS WITH ROUTER
export default withRouter(Form)
