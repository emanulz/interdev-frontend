import React from 'react'
import {connect} from 'react-redux'
import alertify from 'alertifyjs'

import PayMethod from './components/payMethod.jsx'
import PayCash from './components/payCash.jsx'
import PayCard from './components/payCard.jsx'
import PayCredit from './components/payCredit.jsx'
import PayOther from './components/payOther.jsx'
import PaySideBar from './components/paySideBar.jsx'

@connect((store) => {
  return {panelVisible: store.pay.isVisible, payMethod: store.pay.payMethod}
})
export default class PayPanel extends React.Component {

  hidePanel() {

    this.props.dispatch({type: 'HIDE_PAY_PANEL', payload: -1})
  }

  render() {
    const isVisible = (this.props.panelVisible)
      ? 'pay-panel is-visible'
      : 'pay-panel'
 
    let payMethod = ''
    switch (this.props.payMethod) {

      case 'CASH':
      {
        this.props.dispatch({type:'CLEAR_CREDIT'})
        this.props.dispatch({type:'CLEAR_CARD'})
        payMethod = <PayCash />
        break
      } // case

      case 'CARD':
      {
        this.props.dispatch({type:'CLEAR_CREDIT'})
        this.props.dispatch({type:'CLEAR_CASH'})
        payMethod = <PayCard />
        break
      } // case

      case 'CRED':
      {
        this.props.dispatch({type:'CLEAR_CARD'})
        this.props.dispatch({type:'CLEAR_CASH'})
        payMethod = <PayCredit />
        break
      } //  case

      case 'OTHE':
      {
        payMethod = <PayOther />
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
