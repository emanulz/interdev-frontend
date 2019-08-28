/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'
import { setItem } from '../../../../utils/api'
import alertify from 'alertifyjs'

@connect((store) => {
  return {
    client: store.clients.clientActive,
    conf: store.config.globalConf
  }
})
export default class ManualMovement extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      movementType: 'CRED',
      movementAmount: '',
      movementNotes: ''
    }
  }

  componentDidMount() {

    this.props.dispatch({type: 'CLEAR_CLIENT', payload: ''})
    this.props.dispatch({type: 'CLEAR_CLIENT_SALES_WITH_DEBT', payload: ''})

    const lookUp = this.props.location.pathname.split('/').pop()

    const kwargs = {
      lookUpField: 'code',
      url: '/api/clients/',
      lookUpValue: lookUp,
      dispatchType: 'SET_CLIENT',
      dispatchType2: 'SET_CLIENT_OLD',
      dispatchErrorType: 'CLIENT_NOT_FOUND',
      lookUpName: 'código',
      modelName: 'Clientes',
      redirectUrl: '/admin/clients',
      history: this.props.history
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(setItem(kwargs))

  }

  handleInputChange(event) {

    const value = event.target.value
    const name = event.target.name
    const newState = {...this.state}
    newState[name] = value
    this.setState(newState)
  }

  confirmSaveManualMovement() {
    const _this = this
    const amount = this.state.movementAmount ? this.state.movementAmount : 0
    if (amount <= 0) {
      alertify.alert('ERROR', 'No se puede registrar un movimiento con saldo menor o igual a cero')
      return false
    }
    const client = this.props.client
    alertify.confirm('REGISTRAR', `Desea Registrar el movimiento manual de crédito por un monto de ${parseFloat(amount).toFixed(2)}, al cliente ${client.name} ${client.last_name}?`,
      function() {
        _this.saveManualMovement()
      }, function() {
        return true
      }).set('labels', {
      ok: 'Si',
      cancel: 'No'
    })
  }

  saveManualMovement() {
    alertify.alert('UNIMPLEMENTED', 'This function needs to be implemented.')
  }

  // Render the body
  render() {

    const body = this.props.conf.canAddManualCreditMovements ? this.authorizedBody() : this.unAuthorizedBody()
    return body

  }

  authorizedBody = () => {
    const client = this.props.client
    return <div className='manualMovement'>
      <h1>Movimiento Manual de Crédito</h1>
      <div className='manualMovement-header'>
        <div className='manualMovement-header-tittle'>
          <div>
            Cliente:
          </div>
        </div>
        <div className='manualMovement-header-data'>
          <div>
            {`${client.code} - ${client.name} ${client.last_name}`}
          </div>
        </div>
      </div>
      <div className='manualMovement-body'>
        <div className='form-group'>
          <label>Tipo de Movimiento</label>
          <select onChange={this.handleInputChange.bind(this)} className='form-control' name='movementType'
            value={this.state.movementType} >
            <option value='CRED'>Crédito</option>
            <option value='DEBI'>Débito</option>
          </select>
        </div>
        <div className='form-group'>
          <label>Monto</label>
          <input type='number' onChange={this.handleInputChange.bind(this)} className='form-control' name='movementAmount'
            value={this.state.movementAmount} />
        </div>
        <div className='form-group'>
          <label>Notas</label>
          <textarea maxLength='250' rows='4' className='form-control' value={this.state.movementNotes} 
            onChange={this.handleInputChange.bind(this)} name='movementNotes' />
        </div>
      </div>
      <div className='manualMovement-save'>
        <button onClick={this.confirmSaveManualMovement.bind(this)} className='btn btn-success'>Guardar</button>
      </div>
    </div>
  }

  unAuthorizedBody = () => {
    return <div className='manualMovement'>REVISANDO PERMISOS NECESARIOS PARA REALIZAR LA ACCIÓN...</div>
  }

}
