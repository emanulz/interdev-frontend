import React from 'react'
import {connect} from 'react-redux'
import alertify from 'alertifyjs'
import {saveReserveItem} from './actions.js'
import {loadPresaleToPrint} from '../../../../general/printPresale/actions.js'

@connect((store) => {
  return {
    isVisible: store.reserves.isSavePanelVisible,
    cart: store.cart,
    pay: store.pay,
    payMethod: store.pay.payMethod,
    payObject: store.pay.payObject,
    client: store.clients.clientSelected.client,
    user: store.user.user,
    exemptionData: store.taxExemption.exemptionData,
    isExempt: store.taxExemption.isExempt,
    extras: store.extras,
    currency: store.currency.currencySelected,
    exchange: store.currency.exchangeRateSelected
  }
})
export default class PresalesPanel extends React.Component {

  componentWillMount() {

  }

  hidePanel() {
    this.props.dispatch({type: 'HIDE_SAVE_RESERVE_PANEL', payload: -1})
  }

  saveReserve() {
    const _this = this
    alertify.confirm('GUARDAR RESERVA', `Desea guardar la preventa como reserva?`, function() {
      _this.saveBtn()
    }, function() {
      return true
    }).set('labels', {
      ok: 'Guardar',
      cancel: 'Cancelar'
    })
  }

  saveBtn() {
    // const sales = this.props.sales
    document.getElementById('save-presale-as-reserve').disabled = true
    document.getElementById('save-presale-as-reserve').blur()

    const start = Date.now()
    let now = start
    while (now - start < 200) {
      now = Date.now()
    }

    const user = this.props.user

    const cart = this.props.cart
    const exemptionData = this.props.exemptionData
    // the tax Amout for exemption is th exemption total
    exemptionData['exemptAmount'] = cart['cartExemptAmount']
    exemptionData['isExempt'] = this.props.isExempt
    cart['exemption_data'] = exemptionData

    const presale = {
      cart: JSON.stringify(cart),
      client: JSON.stringify(this.props.client),
      user: JSON.stringify(this.props.user),
      client_id: this.props.client.id,
      extras: JSON.stringify(this.props.extras),
      closed: true,
      presale_type: 'RESERVE',
      currency_code: this.props.currency,
      exchange_rate: this.props.exchange
    }

    const kwargs = {
      url: '/api/presales/',
      item: presale,
      user: user
    }

    const _this = this

    const updatePromise = new Promise((resolve, reject) => {
      _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
      _this.props.dispatch(saveReserveItem(kwargs, resolve, reject))
    })

    updatePromise.then((data) => {
      this.props.dispatch({type: 'HIDE_SAVE_RESERVE_PANEL', payload: ''})
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      this.props.dispatch({type: 'PROCESS_COMPLETE', payload: ''})
      document.getElementById('save-as-reserve-btn').disabled = true
      document.getElementById('show-invoice-again-btn').disabled = true
      this.props.dispatch(loadPresaleToPrint(data.consecutive, true))
    }).catch((err) => {
      this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      console.log(err)
      document.getElementById('save-presale-as-reserve').disabled = false
    })

  }

  render() {

    const isVisible = (this.props.isVisible)
      ? 'save-reserves-panel is-visible'
      : 'save-reserves-panel'

    return <div className={isVisible}>
      <div className='save-reserves-panel-header'>
        GUARDAR COMO RESERVA
        <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
      </div>
      <div className='save-reserves-panel-container'>
        <div className='col-xs-12'>
          <div className='save-reserves-panel-container-title'>
            Para guardar la preventa seleccionada como reserva siga los siguientes pasos:
          </div>
          <ol>
            <li>1 - Guarde la reserva con el boton que se muestra al final de este panel.</li>
            <li>2 - Imprima el recibo de ser necesario.</li>
            <li>3 - Refresque la página y proceda a anular la preventa que guardó como reserva.</li>
          </ol>
          <button
            onClick={this.saveReserve.bind(this)}
            id='save-presale-as-reserve'
            style={{
              'height': '48px',
              'width': '49%',
              'marginTop': '10px'
            }}
            className='btn btn-primary btn-save-reserve'>
            Guardar
            <span>
              <i className='fa fa-save' />
            </span>
          </button>
        </div>
      </div>
    </div>

  }

}
