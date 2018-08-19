import React from 'react'
import {connect} from 'react-redux'
import FullInvoice from '../fullInvoice/fullInvoice.jsx'
import CompactInvoice from '../compactInvoice/compactInvoice.jsx'

@connect((store) => {
  return {
    panelVisible: store.reprintInvoice.isVisible,
    isFull: store.reprintInvoice.isFull
  }
})
export default class ReprintInvoicePanel extends React.Component {

  hidePanel() {

    this.props.dispatch({type: 'HIDE_REPRINT_INVOICE_PANEL', payload: -1})
    // printDiv('full-invoice-print')
  }

  togglePanel() {

    this.props.dispatch({type: 'TOGGLE_REPRINT_INVOICE_PANEL_FULL', payload: -1})

  }

  printPanel() {
    window.printDiv('reprint-invoice-print', ['/static/bundles/css/sales.css'])
  }

  render() {

    const isVisible = (this.props.panelVisible)
      ? 'reprint-invoice-panel is-visible'
      : 'reprint-invoice-panel'
    const isFullClass = (this.props.isFull)
      ? ''
      : ' compact-invoice-on'

    const componentToMount = (this.props.isFull)
      ? <FullInvoice />
      : <CompactInvoice />

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
          </div>
        </div>

        <div id='reprint-invoice-print' className={'reprint-invoice-panel-container' + isFullClass}>

          {componentToMount}

        </div>

      </div>

    </div>

  }

}
