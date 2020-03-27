/*
 * Module dependencies
 */
import React from 'react'

import {connect} from 'react-redux'

import {getSingleItemDispatch} from '../../../../../utils/api.js'

import DateRangePicker from '../date/main.jsx'

@connect((store) => {
  return {
    stats_data: store.salesclerks.employees_data,
    start_date: store.salesclerks.start_date,
    end_date: store.salesclerks.end_date
  }
})
export default class SalesclerkSummary extends React.Component {

  componentWillMount() {
    // this.props.dispatch({type: "FETCHING_STARTED"})
    this.props.dispatch({type: "SET_DATE_AS_TODAY"})
  }


  buildSummaryLines(){
    console.log("Employees data --> ", this.props.stats_data)
    if(!this.props.stats_data){
      return <div id="no-data-available">No hay datos disponibles</div>
    }

    const employees_meta = this.props.stats_data.employees
    console.log("Employees data --> ", employees_meta)

    const money_stats = this.props.stats_data.accumulated_money
    console.log("Employees money --> ", money_stats)

    const invoices_stats = this.props.stats_data.accumulated_invoices
    console.log("Employees invoices --> ", invoices_stats)

    const items = employees_meta.length>0?
    employees_meta.map(item=>{
      console.log("Item in iterator --> ", item)
      return <div className="stats-summary-container-row" key={item.id}>

        <div className="stats-summary-container-row-field">
          <div className="stats-summary-container-row-field-label">Usuario:</div>
          <div className="stats-summary-container-row-field-value">{item.user_name}</div>
        </div>

        <div className="stats-summary-container-row-field">
          <div className="stats-summary-container-row-field-label">Nombre:</div>
          <div className="stats-summary-container-row-field-value">{item.name + " " + item.last_name}</div>
        </div>

        <div className="stats-summary-container-row-field">
          <div className="stats-summary-container-row-field-label">Ventas Realizadas:</div>
          <div className="stats-summary-container-row-field-value">{invoices_stats[item.id]}</div>
        </div>

        <div className="stats-summary-container-row-field">
          <div className="stats-summary-container-row-field-label">Dinero recaudado:</div>
          <div className="stats-summary-container-row-field-value">₡ {money_stats[item.id].formatMoney(2,',','.')}</div>
        </div>

      </div>
    })
    : <div>No hay ventas registradas</div>
    

    console.log("Items --> ", items)
    return <div className="stats-summary-container">
      {items}
    </div>
  }

  getData(){
    console.log("Get Salesclerk data")
    const base_url = '/api/saleslist/get_saleskerk_stats'
    const final_url = `${base_url}?start_date=${this.props.start_date}&end_date=${this.props.end_date}`
    const kwargs = {
      url: final_url,
      successType: 'FETCH_GENERAL_DATA_FULFILLED',
      errorType: 'FETCH_GENERAL_DATA_REJECTED'
    }
    this.props.dispatch({type: "FETCHING_STARTED"})
    console.log("Final kwargs --> ", kwargs)
    this.props.dispatch(getSingleItemDispatch(kwargs))
  }
  
  // Main Layout
  render() {

    const summary_content = this.buildSummaryLines()

    return <div className='sales-clerk'>
        <h1>Resumen de ventas por dependiente</h1>
        <DateRangePicker />
        <button className="btn-success btn"
        onClick={this.getData.bind(this)} >
          Obtener Estadísticas
        </button>
        {summary_content}
    </div>

  }

}
