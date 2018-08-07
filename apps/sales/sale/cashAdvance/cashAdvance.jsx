import React from 'react'
import {connect} from 'react-redux'
import {createAdvance, checkAdvanceData} from './actions.js'
import alertify from 'alertifyjs'
import {loadCashAdvanceToPrint} from '../../../../general/printCashAdvance/actions.js'

@connect((store) => {
  return {
    cashAdvanceData: store.cashAdvance.cashAdvanceData,
    isVisible: store.cashAdvance.isVisible,
    client: store.clients.clientSelected.client
  }
})
export default class CashAdvancePanel extends React.Component {

  hidePanel() {
    this.props.dispatch({type: 'HIDE_CASH_ADVANCE_PANEL', payload: -1})
  }

  handleInputChange(event) {
    const target = event.target
    let value
    // const value = target.type === 'checkbox' ? target.checked : target.value
    switch (target.type) {
      case 'checkbox':
      {
        value = target.checked
        break
      }
      case 'number':
      {
        value = parseFloat(target.value)
          ? parseFloat(target.value)
          : 0
        break
      }
      case 'select-one':
      {
        value = target.value
        break
      }
      default:
      {
        value = target.value
      }
    }

    const name = target.name

    const cashAdvanceData = {
      ...this.props.cashAdvanceData
    }

    cashAdvanceData[name] = value

    this.props.dispatch({type: 'SET_CASH_ADVANCE_DATA', payload: cashAdvanceData})
  }

  createCashAdvance() {
    const kwargs = {
      description: this.props.cashAdvanceData.description,
      amount: this.props.cashAdvanceData.amount,
      client_id: this.props.client.id
    }
    const dataOk = checkAdvanceData(kwargs)
    if (dataOk) {
      const _this = this

      const createPromise = new Promise((resolve, reject) => {
        _this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
        createAdvance(kwargs, resolve, reject)
      })

      createPromise.then((data) => {
        console.log(data)
        this.props.dispatch({type: 'HIDE_CASH_ADVANCE_PANEL', payload: ''})
        this.props.dispatch({type: 'FETCHING_DONE', payload: ''})

        this.props.dispatch({type: 'PROCESS_COMPLETE', payload: ''})
        this.props.dispatch(loadCashAdvanceToPrint(data.consecutive))
      }).catch((err) => {
        console.log(err.response.data)
        if (err.response) {
          alertify.alert('ERROR', `${JSON.stringify(err.response.data)}`)
        } else {
          alertify.alert('ERROR', `Hubo un error al guardar el adelanto de efectivo, error: ${err}`)
        }
        this.props.dispatch({type: 'FETCHING_DONE', payload: ''})
      })

    }
  }

  render() {

    const isVisible = (this.props.isVisible)
      ? 'cashAdvance-panel is-visible'
      : 'cashAdvance-panel'
    const clientStr = this.props.client ? `${this.props.client.code} - ${this.props.client.name} ${this.props.client.last_name}` : ''
    return <div className={isVisible}>
      <div className='cashAdvance-panel-header'>
        ADELANTO DE EFECTIVO
        <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
      </div>
      <div className='cashAdvance-panel-container'>
        <div className='form-group col-xs-8'>
          <label>Cliente</label>
          <h2>
            {clientStr}
          </h2>
        </div>
        <div className='form-group col-xs-8'>
          <label>Monto</label>
          <input value={this.props.cashAdvanceData.amount} name='amount' onChange={this.handleInputChange.bind(this)} type='number'
            className='form-control' />
        </div>
        <div className='form-group col-xs-8'>
          <label>Descripción</label>
          <input value={this.props.cashAdvanceData.description} name='description' onChange={this.handleInputChange.bind(this)} type='text'
            className='form-control' />
        </div>
        <div className='form-group col-xs-8 button-container'>
          <button className='form-control btn btn-primary' onClick={this.createCashAdvance.bind(this)}>
            Crear
            <i className='fa fa-money' />
          </button>
        </div>
      </div>
    </div>

  }

}
