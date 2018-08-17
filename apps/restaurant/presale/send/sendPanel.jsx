import React from 'react'
import {connect} from 'react-redux'

import Profile from './components/profile.jsx'
import SetUser from './components/setUser.jsx'
import SendSideBar from './components/sendSideBar.jsx'

@connect((store) => {
  return {panelVisible: store.send.isVisible, presaleType: store.send.presale_type}
})
export default class SendPanel extends React.Component {

  hidePanel() {

    this.props.dispatch({type: 'HIDE_SEND_PANEL', sendload: -1})
  }

  render() {

    const isVisible = (this.props.panelVisible)
      ? 'send-panel is-visible'
      : 'send-panel'
    let presaleTypeText = 'Enviar a Caja'
    if (this.props.presaleType == 'RESERVE') {
      presaleTypeText = 'Guardar Apartado'
    }
    if (this.props.presaleType == 'QUOTING') {
      presaleTypeText = 'Guardar Proforma'
    }

    return <div className={isVisible}>

      <div className='send-panel-main'>
        <div className='send-panel-header'>
          {presaleTypeText}
          <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
        </div>

        <Profile />

        <div className='send-area-container'>

          <SetUser />

          <SendSideBar />

        </div>

      </div>

    </div>

  }

}
