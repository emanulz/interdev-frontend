/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import Clients from '../../general/clients/clients.jsx'
import Totals from './totals/totals.jsx'
import Save from './save/save.jsx'

@connect((store) => {
  return {
    fullWidth: store.moneyReturn.fullWidth,
    returnMethod: store.moneyReturn.return_method
  }
})
export default class Aside extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_FULL_WIDTH', payload: ''})
  }

  changeReturnMethod(ev) {
    this.props.dispatch({type: 'SET_RETURN_METHOD', payload: ev.target.value})
  }

  // Main Layout
  render () {
    const asideClass = this.props.fullWidth ? 'moneyReturn-aside collapsed' : 'moneyReturn-aside'
    const asideContainerClass = this.props.fullWidth ? 'moneyReturn-aside-content collapsed' : 'moneyReturn-aside-content'
    return <div className={asideClass}>
      <div className={asideContainerClass}>
        <div className='moneyReturn-aside-content-header'>
          INFORMACIÓN
          <i className='fa fa-chevron-right' onClick={this.toggleWidth.bind(this)} />
        </div>
        <div className='moneyReturn-aside-content-content'>
          <Clients />
          <Totals />
          <div className='moneyReturn-aside-content-method'>
            <h1>Método de devolución</h1>
            <select onChange={this.changeReturnMethod.bind(this)} className='form-control' name='return_method'
              value={this.props.returnMethod} >
              <option value='CASH'>EFECTIVO</option>
              <option value='VOUCHER'>VOUCHER DE CRÉDITO</option>
            </select>
          </div>
        </div>
        <div className='moneyReturn-aside-content-footer'>
          <Save />
        </div>
      </div>
    </div>
  }

}
