/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import Clients from '../../general/clients/clients.jsx'
import Totals from './totals/totals.jsx'
import Save from './save/save.jsx'
import {getItemDispatch} from '../../../../utils/api.js'

@connect((store) => {
  return {
    fullWidth: store.moneyReturn.fullWidth,
    returnMethod: store.moneyReturn.return_method,
    registerClosures: store.moneyReturn.registerClosures,
    registerClosureSelected: store.moneyReturn.registerClosureSelected,
    config: store.config.globalConf,
    user: store.user.user
  }
})
export default class Aside extends React.Component {

  toggleWidth () {
    this.props.dispatch({type: 'TOGGLE_FULL_WIDTH', payload: ''})
  }

  changeReturnMethod(ev) {
    this.props.dispatch({type: 'SET_RETURN_METHOD', payload: ev.target.value})
  }

  changeRegisterClosure(ev) {
    this.props.dispatch({type: 'SET_REGISTER_CLOSURE', payload: ev.target.value})
  }

  componentWillMount() {
    this.props.dispatch({type: 'CLEAR_REGISTER_CLOSURE', payload: ''})
    this.props.dispatch({type: 'CLEAR_REGISTER_CLOSURES', payload: ''})
    const provinceKwargs = {
      url: '/api/registerclosure/?is_open=True',
      successType: 'FETCH_REGISTER_CLOSURES_FULFILLED',
      errorType: 'FETCH_REGISTER_CLOSURES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getItemDispatch(provinceKwargs))
  }

  // Main Layout
  render () {
    const asideClass = this.props.fullWidth ? 'moneyReturn-aside collapsed' : 'moneyReturn-aside'
    const asideContainerClass = this.props.fullWidth ? 'moneyReturn-aside-content collapsed' : 'moneyReturn-aside-content'
    const closures = this.props.registerClosures.map((item) => {
      return <option key={item.id} value={item.id}>{`${item.cashier_id} - ${item.cashier_name}`}</option>
    })
    closures.splice(0, 0, <option key='blank' value='' />)
    const selectRC = this.props.config.AdminsCanChooseRCInReturns && this.props.user.is_superuser
      ? <div className='moneyReturn-aside-content-method'>
        <h1>Cierre de Caja</h1>
        <select onChange={this.changeRegisterClosure.bind(this)} className='form-control' name='return_method'
          value={this.props.registerClosureSelected} >
          {closures}
        </select>
      </div>
      : ''
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
          {selectRC}
        </div>
        <div className='moneyReturn-aside-content-footer'>
          <Save />
        </div>
      </div>
    </div>
  }

}
