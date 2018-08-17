import React from 'react'
import {connect} from 'react-redux'
import {loadGlobalConfig} from '../../../utils/api.js'
import FullInvoice from '../fullInvoice/fullInvoice.jsx'
import CompactInvoice from '../compactInvoice/compactInvoice.jsx'
import {loadCashAdvanceToPrint} from '../actions.js'

@connect((store) => {
  return {
    panelVisible: store.printCashAdvance.isVisible,
    isFull: store.printCashAdvance.isFull
  }
})
export default class PrintCashAdvancePanel extends React.Component {

  componentWillMount () {
    this.props.dispatch(loadGlobalConfig('company', false, 'SET_PRINT_CASH_ADVANCE_COMPANY', 'CLEAR_PRINT_CASH_ADVANCE_COMPANY'))
  }

  hidePanel() {

    this.props.dispatch({type: 'HIDE_PRINT_CASH_ADVANCE_PANEL', payload: -1})
    // printDiv('full-invoice-print')
  }

  togglePanel() {

    this.props.dispatch({type: 'TOGGLE_PRINT_CASH_ADVANCE_PANEL_FULL', payload: -1})

  }

  printPanel() {
    window.printDiv('cash-advance-print', ['/static/bundles/css/sales.css'])
  }

  render() {

    const isVisible = (this.props.panelVisible)
      ? 'cash-advance-panel is-visible'
      : 'cash-advance-panel'
    const isFullClass = (this.props.isFull)
      ? ''
      : ' compact-invoice-on'

    const componentToMount = (this.props.isFull)
      ? <FullInvoice />
      : <CompactInvoice />

    return <div className={isVisible}>

      <div className={'cash-advance-panel-main' + isFullClass}>
        <div className='cash-advance-panel-header'>
          <div>
            Adelanto de Dinero
          </div>
          <div>
            <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
            <i onClick={this.togglePanel.bind(this)} className='fa fa-file-text-o' aria-hidden='true' />
            <i onClick={this.printPanel.bind(this)} className='fa fa-print' aria-hidden='true' />
            {/* <i onClick={this.toggleInvoice.bind(this)} className='fa fa-coffee' aria-hidden='true' /> */}
          </div>
        </div>

        <div id='cash-advance-print' className={'cash-advance-panel-container' + isFullClass}>

          {componentToMount}

        </div>

      </div>

    </div>

  }

}