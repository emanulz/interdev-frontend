import React from 'react'
import {connect} from 'react-redux'
import FullInvoice from '../fullInvoice/fullInvoice.jsx'
import CompactInvoice from '../compactInvoice/compactInvoice.jsx'

@connect((store) => {
  return {
    panelVisible: store.printRegisterClosure.isVisible,
    isFull: store.printRegisterClosure.isFull
  }
})
export default class ReprintRegisterClosurePanel extends React.Component {

  hidePanel() {

    this.props.dispatch({type: 'HIDE_PRINT_REGISTER_CLOSURE_PANEL', payload: -1})
    // printDiv('full-invoice-print')
  }

  togglePanel() {

    this.props.dispatch({type: 'TOGGLE_PRINT_REGISTER_CLOSURE_PANEL_FULL', payload: -1})

  }

  printPanel() {
    window.printDiv('print-register-closure-print', ['/static/fixedBundles/css/sales.css'])
  }

  render() {

    const isVisible = (this.props.panelVisible)
      ? 'print-register-closure-panel is-visible'
      : 'print-register-closure-panel'
    const isFullClass = (this.props.isFull)
      ? ''
      : ' compact-invoice-on'

    const componentToMount = (this.props.isFull)
      ? <FullInvoice />
      : <CompactInvoice />

    return <div className={isVisible}>

      <div className={'print-register-closure-panel-main' + isFullClass}>
        <div className='print-register-closure-panel-header'>
          <div>
            RECIBO CIERRE DE CAJA
          </div>
          <div>
            <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
            <i onClick={this.togglePanel.bind(this)} className='fa fa-file-text-o' aria-hidden='true' />
            <i onClick={this.printPanel.bind(this)} className='fa fa-print' aria-hidden='true' />
            {/* <i onClick={this.toggleInvoice.bind(this)} className='fa fa-coffee' aria-hidden='true' /> */}
          </div>
        </div>

        <div id='print-register-closure-print' className={'print-register-closure-panel-container' + isFullClass}>

          {componentToMount}

        </div>

      </div>

    </div>

  }

}
