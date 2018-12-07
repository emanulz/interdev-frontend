import React from 'react'
import {connect} from 'react-redux'
import FullInvoice from '../fullInvoice/fullInvoice.jsx'
import CompactInvoice from '../compactInvoice/compactInvoice.jsx'
import SimpleCompactInvoice from '../simpleCompactInvoice/simpleCompactInvoice.jsx'

@connect((store) => {
  return {
    panelVisible: store.reprintInvoice.isVisible,
    isFull: store.reprintInvoice.isFull,
    sale: store.reprintInvoice.sale,
    config: store.config.globalConf,
    receiptStyles: store.config.receiptStyles
  }
})
export default class ReprintInvoicePanel extends React.Component {

  componentWillReceiveProps(nextProps) {
    if (this.props.config != nextProps.config) {
      this.props.dispatch({type: 'SET_REPRINT_INVOICE_PANEL_FULL', payload: nextProps.config.defaultInvoiceFull})
    }
  }

  hidePanel() {

    this.props.dispatch({type: 'HIDE_REPRINT_INVOICE_PANEL', payload: -1})
    // printDiv('full-invoice-print')
  }

  togglePanel() {

    this.props.dispatch({type: 'TOGGLE_REPRINT_INVOICE_PANEL_FULL', payload: -1})

  }

  printPanel() {
    window.printDiv('reprint-invoice-print', ['/static/fixedBundles/css/sales.css'])
  }

  calcTotalInPay () {
    const pay = this.props.sale.pay
    let total = 0
    for (const item in pay) {
      let innerAmount = 0
      for (const innerItem in pay[item]) {
        innerAmount += pay[item][innerItem].amount
      }
      total += innerAmount
    }
    return total
  }

  getZpl(){
    document.getElementById('link').click()
  }

  render() {

    const isVisible = (this.props.panelVisible)
      ? 'reprint-invoice-panel is-visible'
      : 'reprint-invoice-panel'
    const isFullClass = (this.props.isFull)
      ? ''
      : ' compact-invoice-on'

    const compactInvoice = this.props.receiptStyles.useSimpleCompactInvoice ? <SimpleCompactInvoice /> : <CompactInvoice />

    const componentToMount = (this.props.isFull)
      ? <FullInvoice />
      : compactInvoice

    let change = ''
    try {
      const total = parseFloat(this.props.sale.cart.cartTotal)
      const totalInPay = this.calcTotalInPay()
      change = totalInPay - total
    } catch (err) {
      console.log(err)
    }

    let zpl_button = ''
    let zpl_link = ''
    if(this.props.config){
      if(this.props.config.EnableZplDownloads){
        if(this.props.sale){
          zpl_link = <a id="link" href={`/api/saleslist/get_zpl/?sale_consec=${this.props.sale.consecutive}`}></a>
        }
      }

      zpl_button = <i onClick={this.getZpl.bind(this)} className='fa fa-download' aria-hidden='true' />
    }

    return <div className={isVisible}>

      <div className={'reprint-invoice-panel-main' + isFullClass}>
        <div className='reprint-invoice-panel-header'>
          <div>
            Factura de Venta
          </div>
          <div>
            <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
            <i onClick={this.togglePanel.bind(this)} className='fa fa-file-text-o' aria-hidden='true' />
            <i onClick={this.printPanel.bind(this)} className='fa fa-print' aria-hidden='true' />
            {/* <i onClick={this.toggleInvoice.bind(this)} className='fa fa-coffee' aria-hidden='true' /> */}
            {zpl_button}
            {zpl_link}
          </div>
        </div>

        <div id='reprint-invoice-print' className={'reprint-invoice-panel-container' + isFullClass}>

          {componentToMount}

        </div>

      </div>

      <div className='reprint-invoice-panel-main-change'>
        <span>CAMBIO</span>
        <h1>₡ {parseFloat(change).formatMoney(2, ',', '.')}</h1>
      </div>

    </div>

  }

}
