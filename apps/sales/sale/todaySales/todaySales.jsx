import React from 'react'
import {connect} from 'react-redux'
import {formatDateTimeAmPm} from '../../../../utils/formatDate.js'
import {getTodaySales} from './actions.js'
import {loadSaleToReprint} from '../../../../general/reprintInvoice/actions.js'

@connect((store) => {
  return {todaySales: store.todaySales.todaySales, isVisible: store.todaySales.isVisible}
})
export default class TodaySalesPanel extends React.Component {

  componentWillMount() {
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    const kwargs = {
      url: '/api/saleslist',
      ordering: '-consecutive',
      filterField: 'start_date',
      filter: dateStr,
      successType: 'FETCH_TODAY_SALES_FULFILLED',
      errorType: 'FETCH_TODAY_SALES_REJECTED'
    }
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(getTodaySales(kwargs))
  }

  hidePanel() {
    this.props.dispatch({type: 'HIDE_TODAY_SALES_PANEL', payload: -1})
  }

  loadSaleToPrint(consecutive) {
    this.props.dispatch({type: 'FETCHING_STARTED', payload: ''})
    this.props.dispatch(loadSaleToReprint(consecutive))
  }

  render() {

    const isVisible = (this.props.isVisible)
      ? 'todaySales-panel is-visible'
      : 'todaySales-panel'

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todaySales = this.props.todaySales

    const itemsToRender = todaySales.map(presale => {
      const presellerName = presale.user.first_name
        ? `${presale.user.first_name} ${presale.user.last_name}`
        : `${presale.user.username}`
      return <tr key={presale.id}>
        <td onClick={this.loadSaleToPrint.bind(this, presale.consecutive)} className='loadRow'><i className='fa fa-list' /></td>
        <td>{presale.consecutive}</td>
        <td>{`${formatDateTimeAmPm(presale.created)}`}</td>
        <td>{`${presale.client.name} ${presale.client.last_name}`}</td>
        <td className='preseller'>{presellerName}</td>
        <td>₡ {parseFloat(presale.cart.cartTotal).formatMoney(2, ',', '.')}</td>
      </tr>
    })

    return <div className={isVisible}>
      <div className='todaySales-panel-header'>
        VENTAS DEL DIA
        <i onClick={this.hidePanel.bind(this)} className='fa fa-times' aria-hidden='true' />
      </div>
      <div className='todaySales-panel-container'>
        <div className='col-xs-12'>
          <table className='table'>
            <thead>
              <tr>
                <td>Reimprimir</td>
                <td>#</td>
                <td>Fecha</td>
                <td>Cliente</td>
                <td className='preseller'>Cajero</td>
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
