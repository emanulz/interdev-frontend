import React from 'react'
import {connect} from 'react-redux'

import PayMethod from './components/payMethod.jsx'
import PayCash from './components/payCahs.jsx'
import PayCard from './components/payCard.jsx'
import PayCredit from './components/payCredit.jsx'
import PayVoucher from './components/payVoucher.jsx'
import PaySideBar from './components/paySideBar.jsx'
import PayTransfer from './components/payTransfer.jsx'
const Mousetrap = require('mousetrap')

@connect((store) => {
  return {
    panelVisible: store.pay.isVisible,
    payMethod: store.pay.payMethodActive,
    default_invoice: store.userProfile.activeLocal.default_invoice,
    tp_activities: store.userProfile.activeLocal.tax_activities,
  }
})
export default class PayPanel extends React.Component {

  hidePanel() {

    this.props.dispatch({type: 'HIDE_PAY_PANEL', payload: -1})
    this.props.dispatch({type: 'CLEAR_PAY_OBJECT', payload: -1})
    Mousetrap.unbind('esc')
    document.getElementById('productCodeInputField').focus()
    document.getElementById('productCodeInputField').value = ''
  }

  componentWillUpdate(nextProps) {
    // set the default electronic doc according to the local preference
    if (this.props.default_invoice == undefined && nextProps.default_invoice !== undefined) {
      this.props.dispatch({type: 'SET_IS_INVOICE_VALUE',
        payload: nextProps.default_invoice === true ? 'FACTURA' : 'TIQUETE'})
    }

    if (this.props.tp_activities == undefined && nextProps.tp_activities !== undefined) {

      let activities_raw = nextProps.tp_activities
      activities_raw = activities_raw.split(',')
      const code = activities_raw[0].split('_')[0]

      this.props.dispatch({type: 'SET_DOC_ACTIVITY', payload: code})

    }

  }

  render() {

    const isVisible = (this.props.panelVisible)
      ? 'pay-panel is-visible'
      : 'pay-panel'

    let payMethod = ''
    switch (this.props.payMethod) {

      case 'CASH':
      {
        payMethod = <PayCash />
        break
      } // case

      case 'CARD':
      {
        payMethod = <PayCard />
        break
      } // case

      case 'CRED':
      {
        payMethod = <PayCredit />
        break
      } //  case

      case 'VOUC':
      {
        payMethod = <PayVoucher />
        break
      } // case

      case 'TRAN':
      {
        payMethod = <PayTransfer />
        break
      } // case

    } // switch

    return <div className={isVisible}>

      <div className='pay-panel-main'>
        <div className='pay-panel-header'>
          Registrar Pago
          <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
        </div>

        <PayMethod />

        <div className='pay-area-container'>

          {payMethod}

          <PaySideBar />

        </div>

      </div>

    </div>

  }

}
