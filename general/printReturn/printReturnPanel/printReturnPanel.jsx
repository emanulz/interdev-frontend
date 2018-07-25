import React from 'react'
import {connect} from 'react-redux'
import {loadGlobalConfig} from '../../../utils/api.js'
import FullInvoice from '../fullInvoice/fullInvoice.jsx'
import CompactInvoice from '../compactInvoice/compactInvoice.jsx'

@connect((store) => {
  return {
    panelVisible: store.printReturn.isVisible,
    isFull: store.printReturn.isFull
  }
})
export default class ReprintInvoicePanel extends React.Component {

  componentWillMount () {
    this.props.dispatch(loadGlobalConfig('company', false, 'SET_PRINT_RETURN_COMPANY', 'CLEAR_PRINT_RETURN_COMPANY'))
  }

  hidePanel() {

    this.props.dispatch({type: 'HIDE_PRINT_RETURN_PANEL', payload: -1})
    // printDiv('full-invoice-print')
  }

  togglePanel() {

    this.props.dispatch({type: 'TOGGLE_PRINT_RETURN_PANEL_FULL', payload: -1})

  }

  printPanel() {
    window.printDiv('print-return-print', ['/static/bundles/css/returns.css'])
  }

  render() {

    const isVisible = (this.props.panelVisible)
      ? 'print-return-panel is-visible'
      : 'print-return-panel'
    const isFullClass = (this.props.isFull)
      ? ''
      : ' compact-invoice-on'

    const componentToMount = (this.props.isFull)
      ? <FullInvoice />
      : <CompactInvoice />

    return <div className={isVisible}>

      <div className={'print-return-panel-main' + isFullClass}>
        <div className='print-return-panel-header'>
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

        <div id='print-return-print' className={'print-return-panel-container' + isFullClass}>

          {componentToMount}

        </div>

      </div>

    </div>

  }

}
