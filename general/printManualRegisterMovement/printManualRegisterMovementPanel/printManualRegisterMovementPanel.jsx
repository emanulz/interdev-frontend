import React from 'react'
import {connect} from 'react-redux'
import CompactInvoice from '../compactInvoice/compactInvoice.jsx'

@connect((store) => {
  return {
    panelVisible: store.printManualRegisterMovement.isVisible,
    isFull: false
  }
})
export default class PrintManualRegisterMovementPanel extends React.Component {

  hidePanel() {

    this.props.dispatch({type: 'HIDE_PRINT_MANUAL_REGISTER_MOVEMENT_PANEL', payload: -1})
    // printDiv('full-invoice-print')
  }

  togglePanel() {

    this.props.dispatch({type: 'TOGGLE_PRINT_MANUAL_REGISTER_MOVEMENT_PANEL_FULL', payload: -1})

  }

  printPanel() {
    window.printDiv('manual-register-movement-print', ['/static/fixedBundles/css/sales.css'])
  }

  render() {

    const isVisible = (this.props.panelVisible)
      ? 'manual-register-movement-panel is-visible'
      : 'manual-register-movement-panel'
    const isFullClass = (this.props.isFull)
      ? ''
      : ' compact-invoice-on'

    // const componentToMount = (this.props.isFull)
    //   ? <FullInvoice />
    //   : <CompactInvoice />

    return <div className={isVisible}>

      <div className={'manual-register-movement-panel-main' + isFullClass}>
        <div className='manual-register-movement-panel-header'>
          <div>
            Movimiento manual de caja
          </div>
          <div>
            <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
            {/* <i onClick={this.togglePanel.bind(this)} className='fa fa-file-text-o' aria-hidden='true' /> */}
            <i onClick={this.printPanel.bind(this)} className='fa fa-print' aria-hidden='true' />
            {/* <i onClick={this.toggleInvoice.bind(this)} className='fa fa-coffee' aria-hidden='true' /> */}
          </div>
        </div>

        <div id='manual-register-movement-print' className={'manual-register-movement-panel-container' + isFullClass}>

          <CompactInvoice />

        </div>

      </div>

    </div>

  }

}
