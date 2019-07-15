import React from 'react'
import {connect} from 'react-redux'
import FullInvoice from '../fullInvoice/fullInvoice.jsx'
// import CompactInvoice from '../compactInvoice/compactInvoice.jsx'

@connect((store) => {
  return {
    panelVisible: store.printRequest.isVisible,
    isFull: store.printRequest.isFull
  }
})
export default class PrintRequestPanel extends React.Component {

  hidePanel() {

    this.props.dispatch({type: 'HIDE_PRINT_REQUEST_PANEL', payload: -1})
    // printDiv('full-invoice-print')
  }

  togglePanel() {

    this.props.dispatch({type: 'TOGGLE_PRINT_REQUEST_PANEL_FULL', payload: -1})

  }

  printPanel() {
    window.printDiv('print-request-print', ['/static/fixedBundles/css/purchases.css'])
  }

  render() {

    const isVisible = (this.props.panelVisible)
      ? 'print-request-panel is-visible'
      : 'print-request-panel'
    const isFullClass = (this.props.isFull)
      ? ''
      : ' compact-invoice-on'

    // const componentToMount = (this.props.isFull)
    //   ? <FullInvoice />
    //   : <CompactInvoice />

    return <div className={isVisible}>

      <div className={'print-request-panel-main' + isFullClass}>
        <div className='print-request-panel-header'>
          <div>
            Orden de Cotización
          </div>
          <div>
            <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
            {/* <i onClick={this.togglePanel.bind(this)} className='fa fa-file-text-o' aria-hidden='true' /> */}
            <i onClick={this.printPanel.bind(this)} className='fa fa-print' aria-hidden='true' />
            {/* <i onClick={this.toggleInvoice.bind(this)} className='fa fa-coffee' aria-hidden='true' /> */}
          </div>
        </div>

        <div id='print-request-print' className={'print-request-panel-container' + isFullClass}>

          <FullInvoice />

        </div>

      </div>

    </div>

  }

}
