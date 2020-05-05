/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import Form from './components/form.jsx'
import ClientCreateSave from './components/save.jsx'
// import { getItemDispatch } from '../../utils/api'

@connect((store) => {
  return {
    panelVisible: store.clientCreatePanel.isVisible
  }
})
export default class ClientCreatePanel extends React.Component {
  hidePanel() {
    this.props.dispatch({type: 'HIDE_CREATE_CLIENT_PANEL', payload: -1})
  }

  
  render() {

    const isVisible = (this.props.panelVisible)
      ? 'clientCreatePanel is-visible'
      : 'clientCreatePanel'

    return <div className={isVisible}>
      <div className='clientCreatePanel-container'>
        <div className='clientCreatePanel-header'>
          Creación Rápida de Cliente
          <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
        </div>
        <div className='clientCreatePanel-content'>
          <Form />
          <ClientCreateSave />
        </div>
      </div>
    </div>

  }

}
