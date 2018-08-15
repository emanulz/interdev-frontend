/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import Form from './components/form.jsx'
import ClientCreateSave from './components/save.jsx'
import { getItemDispatch } from '../../utils/api'

@connect((store) => {
  return {
    panelVisible: store.clientCreatePanel.isVisible
  }
})
export default class ClientCreatePanel extends React.Component {
  hidePanel() {
    this.props.dispatch({type: 'HIDE_CREATE_CLIENT_PANEL', payload: -1})
  }

  componentWillMount() {
    // Then fetch provinces of the model and dispatch to reducer
    // *******************************************************************
    const provinceKwargs = {
      url: '/api/provinces/?limit=6000',
      successType: 'FETCH_PROVINCES_FULFILLED',
      errorType: 'FETCH_PROVINCES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(provinceKwargs))
    // *******************************************************************

    // Then fetch cantons of the model and dispatch to reducer
    // *******************************************************************
    const cantonKwargs = {
      url: '/api/cantons/?limit=6000',
      successType: 'FETCH_CANTONS_FULFILLED',
      errorType: 'FETCH_CANTONS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(cantonKwargs))
    // *******************************************************************

    // Then fetch districts of the model and dispatch to reducer
    // *******************************************************************
    const districtKwargs = {
      url: '/api/districts/?limit=6000',
      successType: 'FETCH_DISTRICTS_FULFILLED',
      errorType: 'FETCH_DISTRICTS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(districtKwargs))
    // *******************************************************************

    // Then fetch towns of the model and dispatch to reducer
    // *******************************************************************
    const townKwargs = {
      url: '/api/towns/?limit=7000',
      successType: 'FETCH_TOWNS_FULFILLED',
      errorType: 'FETCH_TOWNS_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(townKwargs))
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
