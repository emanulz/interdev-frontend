import React from 'react'
import {connect} from 'react-redux'
import FullInvoice from '../fullInvoice/fullInvoice.jsx'
// import CompactInvoice from '../compactInvoice/compactInvoice.jsx'

@connect((store) => {
  return {
    panelVisible: store.printOrder.isVisible,
    isFull: store.printOrder.isFull
  }
})
export default class PrintOrderPanel extends React.Component {

  hidePanel() {

    this.props.dispatch({type: 'HIDE_PRINT_ORDER_PANEL', payload: -1})
    // printDiv('full-invoice-print')
  }

  togglePanel() {

    this.props.dispatch({type: 'TOGGLE_PRINT_ORDER_PANEL_FULL', payload: -1})

  }

  printPanel() {
    window.printDiv('print-order-print', ['/static/fixedBundles/css/purchases.css'])
  }

  render() {

    const isVisible = (this.props.panelVisible)
      ? 'print-order-panel is-visible'
      : 'print-order-panel'
    const isFullClass = (this.props.isFull)
      ? ''
      : ' compact-invoice-on'

    // const componentToMount = (this.props.isFull)
    //   ? <FullInvoice />
    //   : <CompactInvoice />

    return <div className={isVisible}>

      <div className={'print-order-panel-main' + isFullClass}>
        <div className='print-order-panel-header'>
          <div>
            Ordern de Compra
          </div>
          <div>
            <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
            {/* <i onClick={this.togglePanel.bind(this)} className='fa fa-file-text-o' aria-hidden='true' /> */}
            <i onClick={this.printPanel.bind(this)} className='fa fa-print' aria-hidden='true' />
            {/* <i onClick={this.toggleInvoice.bind(this)} className='fa fa-coffee' aria-hidden='true' /> */}
          </div>
        </div>

        <div id='print-order-print' className={'print-order-panel-container' + isFullClass}>

          <FullInvoice />

        </div>

      </div>

    </div>

  }

}
