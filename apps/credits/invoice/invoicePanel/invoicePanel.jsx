import React from 'react'
import {connect} from 'react-redux'
import {loadGlobalConfig} from '../../../../utils/api.js'
import {getClientPendingSales} from '../../../../utils/getClientPendingSales'
import FullInvoice from '../fullInvoice/fullInvoice.jsx'
import CompactInvoice from '../compactInvoice/compactInvoice.jsx'

@connect((store) => {
  return {
    panelVisible: store.invoice.isVisible,
    isFull: store.invoice.isFull,
    config: store.config.globalConf,
    payment: store.payments.paymentActive,
  }
})
export default class InvoicePanel extends React.Component {

  componentWillMount () {
    this.props.dispatch(loadGlobalConfig('company', false, 'FETCH_CONFIG_FULFILLED', 'FETCH_CONFIG_REJECTED'))
    this.props.dispatch(loadGlobalConfig('global_conf', false, 'FETCH_GLOBAL_CONF_FULFILLED', 'FETCH_GLOBAL_CONF_REJECTED'))
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.config != nextProps.config) {
      this.props.dispatch({type: 'SET_INVOICE_PANEL_FULL', payload: nextProps.config.defaultInvoiceFull})
    }
    const newId = nextProps.payment.client ? nextProps.payment.client.id : '0000000000'
    const oldId = this.props.payment.client ? this.props.payment.client.id : '0000000000'

    if (newId != '0000000000' && newId != oldId) {

      this.props.dispatch({type: 'CLEAR_CLIENT_SALES_WITH_DEBT', payload: ''})

      const id = newId
      const code = nextProps.payment.client.code
      const kwargs = {
        url: `/api/creditpaymentslist/get_client_bills/?code=${code}`,
        clientId: id,
        successType: 'FETCH_CLIENT_SALES_WITH_DEBT_FULFILLED',
        errorType: 'FETCH_CLIENT_SALES_WITH_DEBT_REJECTED'
      }

      this.props.dispatch(getClientPendingSales(kwargs))

    }
  }

  hidePanel() {

    this.props.dispatch({type: 'HIDE_INVOICE_PANEL', payload: -1})
    // printDiv('full-invoice-print')
  }

  togglePanel() {

    this.props.dispatch({type: 'TOGGLE_INVOICE_PANEL', payload: -1})

  }

  toggleInvoice() {

    this.props.dispatch({type: 'TOGGLE_INVOICE_DESING', payload: -1})

  }

  printPanel() {
    window.printDiv('invoice-print', ['/static/fixedBundles/css/credits.css'])
  }

  getZplPayment(){
    console.log("HERE")
    document.getElementById('link_payment_zpl').click()
  }

  render() {

    const isVisible = (this.props.panelVisible)
      ? 'invoice-panel is-visible'
      : 'invoice-panel'
    const isFullClass = (this.props.isFull)
      ? ''
      : ' compact-invoice-on'

    const componentToMount = (this.props.isFull)
      ? <FullInvoice />
      : <CompactInvoice />

      let zpl_button = ''
      let zpl_link = ''
      if(this.props.config){
        if(this.props.config.EnableZplDownloads){
          if(this.props.payment){
            // zpl_link = <a id="link_payment" href={`/api/saleslist/get_zpl_closure/?closure_id=${this.props.registerClosure.id}`}></a>
            zpl_link = <a id="link_payment_zpl" href={`/api/creditpaymentslist/getCreditPaymentZPL/?payment_consecutive=${this.props.payment.consecutive}`}></a>
            
            zpl_button = <i onClick={this.getZplPayment.bind(this)} className='fa fa-download' aria-hidden='true' />
          }
        }
        zpl_link = <a id="link_payment_zpl" href={`/api/creditpaymentslist/getCreditPaymentZPL/?payment_consecutive=${this.props.payment.consecutive}`}></a>
        
      }  

    return <div className={isVisible}>

      <div className={'invoice-panel-main' + isFullClass}>
        <div className='invoice-panel-header'>
          <div>
            Recibo de pago
          </div>
          <div>
            <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
            <i onClick={this.togglePanel.bind(this)} className='fa fa-file-text-o' aria-hidden='true' />
            <i onClick={this.printPanel.bind(this)} className='fa fa-print' aria-hidden='true' />
            {zpl_button}
            {zpl_link}
          </div>
        </div>

        <div id='invoice-print' className={'invoice-panel-container' + isFullClass}>

          {componentToMount}

        </div>

      </div>

    </div>

  }

}
