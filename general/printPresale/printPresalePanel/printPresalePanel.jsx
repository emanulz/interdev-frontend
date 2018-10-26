import React from 'react'
import {connect} from 'react-redux'
import FullInvoice from '../fullInvoice/fullInvoice.jsx'
import CompactInvoice from '../compactInvoice/compactInvoice.jsx'

@connect((store) => {
  return {
    panelVisible: store.printPresale.isVisible,
    isFull: store.printPresale.isFull
  }
})
export default class PrintPresalePanel extends React.Component {

  hidePanel() {

    this.props.dispatch({type: 'HIDE_PRINT_PRESALE_PANEL', payload: -1})
    // printDiv('full-invoice-print')
  }

  togglePanel() {

    this.props.dispatch({type: 'TOGGLE_PRINT_PRESALE_PANEL_FULL', payload: -1})

  }

  printPanel() {
    window.printDiv('print-presale-print', ['/static/fixedBundles/css/sales.css'])
  }

  render() {

    const isVisible = (this.props.panelVisible)
      ? 'print-presale-panel is-visible'
      : 'print-presale-panel'
    const isFullClass = (this.props.isFull)
      ? ''
      : ' compact-invoice-on'

    const componentToMount = (this.props.isFull)
      ? <FullInvoice />
      : <CompactInvoice />

    return <div className={isVisible}>

      <div className={'print-presale-panel-main' + isFullClass}>
        <div className='print-presale-panel-header'>
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

        <div id='print-presale-print' className={'print-presale-panel-container' + isFullClass}>

          {componentToMount}

        </div>

      </div>

    </div>

  }

}
