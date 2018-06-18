import React from 'react'
import {connect} from 'react-redux'

import Profile from './components/profile.jsx'
import SetUser from './components/setUser.jsx'
import SendSideBar from './components/sendSideBar.jsx'

@connect((store) => {
  return {panelVisible: store.send.isVisible}
})
export default class SendPanel extends React.Component {

  hidePanel() {

    this.props.dispatch({type: 'HIDE_SEND_PANEL', sendload: -1})
  }

  render() {

    const isVisible = (this.props.panelVisible)
      ? 'send-panel is-visible'
      : 'send-panel'

    return <div className={isVisible}>

      <div className='send-panel-main'>
        <div className='send-panel-header'>
          Enviar a caja
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
