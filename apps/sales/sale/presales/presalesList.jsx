import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'
import {loadPresale, getPendingPresales} from './actions.js'

@connect((store) => {
  return {presales: store.presales.presales, isVisible: store.presales.isVisible}
})
export default class PresalesPanel extends React.Component {

  componentWillMount() {
    const kwargs = {
      url: '/api/presales',
      ordering: '-consecutive',
      filterField: 'closed',
      filter: true,
      filterField2: 'billed',
      filter2: false,
      filterField3: 'is_null',
      filter3: false,
      successType: 'FETCH_PRESALES_FULFILLED',
      errorType: 'FETCH_PRESALES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getPendingPresales(kwargs))
  }

  hidePanel() {
    this.props.dispatch({type: 'HIDE_PRESALES_PANEL', payload: -1})
  }

  loadPresaleItem(id, ev) {
    this.props.dispatch(loadPresale(id, this.props.presales))
    this.props.dispatch({type: 'HIDE_PRESALES_PANEL', payload: -1})
    const _this = this
    setTimeout(function() { _this.props.dispatch({type: 'LOADED_FALSE', payload: ''}) }, 500)
    // dispatch({type: 'LOADED_FALSE', payload: ''})
  }

  render() {

    const isVisible = (this.props.isVisible)
      ? 'presales-panel is-visible'
      : 'presales-panel'

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const presales = this.props.presales

    const itemsToRender = presales.map(presale => {
      return <tr key={presale.id}>
        <td className='loadRow'><i onClick={this.loadPresaleItem.bind(this, presale.id)} className='fa fa-download' /></td>
        <td>{presale.consecutive}</td>
        <td>{`${formatDateTimeAmPm(presale.created)}`}</td>
        <td>{`${presale.client.name} ${presale.client.last_name}`}</td>
        <td>₡ {parseFloat(presale.cart.cartTotal).formatMoney(2, ',', '.')}</td>
      </tr>
    })

    return <div className={isVisible}>
      <div className='presales-panel-header'>
        PREVENTAS SIN FACTURAR
        <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
      </div>
      <div className='presales-panel-container'>
        <div className='col-xs-12'>
          <table className='table'>
            <thead>
              <tr>
                <td>Cargar</td>
                <td>#</td>
                <td>Fecha</td>
                <td>Cliente</td>
                <td>Monto</td>
              </tr>
            </thead>
            <tbody>
              {itemsToRender}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  }

}
