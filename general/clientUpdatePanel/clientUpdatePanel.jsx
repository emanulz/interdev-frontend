/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import Form from './components/form.jsx'
import ClientUpdateSave from './components/save.jsx'

@connect((store) => {
  return {
    panelVisible: store.clientUpdatePanel.isVisible
  }
})
export default class ClientUpdatePanel extends React.Component {
  hidePanel() {
    this.props.dispatch({type: 'HIDE_UPDATE_CLIENT_PANEL', payload: -1})
  }

  render() {

    const isVisible = (this.props.panelVisible)
      ? 'clientUpdatePanel is-visible'
      : 'clientUpdatePanel'

    return <div className={isVisible}>
      <div className='clientUpdatePanel-container'>
        <div className='clientUpdatePanel-header'>
          Edición Rápida de Cliente
          <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
        </div>
        <div className='clientUpdatePanel-content'>
          <Form />
          <ClientUpdateSave />
        </div>
      </div>
    </div>

  }

}
