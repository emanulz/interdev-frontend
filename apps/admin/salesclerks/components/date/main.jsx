/*
 * Module dependencies
 */
import React from 'react'
import {connect} from 'react-redux'

@connect((store) => {
  return {
    start_date: store.salesclerks.start_date,
    end_date: store.salesclerks.end_date

  }
})
export default class DateRangePicker extends React.Component {

  componentWillMount() {
    this.props.dispatch({type:'SET_DATE_AS_TODAY'})
  }

  handleToday(){
      console.log("yay, set date to today")
      this.props.dispatch({type:"SET_DATE_AS_TODAY"})
  }

  handleYesterday(){
    console.log("yay, go back marti")
    this.props.dispatch({type:"SET_DATE_AS_YESTERDAY"})
  }

  handleLast7Days(){
    console.log("yay, go back 7 days marti")
    this.props.dispatch({type:"SET_TO_LAST_X_DAYS", payload:7})
  }

  handleLast30Days(){
    console.log("yay, go back 30 days marti")
    this.props.dispatch({type:"SET_TO_LAST_X_DAYS", payload:30})
  }

  handleNextMonth(direction, e){
      console.log("Jump a month")
      this.props.dispatch({type:"JUMP_TO_NEXT_MONTH_MONTH", payload:direction})
  }


  // Main Layout
  render() {

    return <div className='date-range-picker'>
        <h2>Seleccione el periodo a cubrir:</h2>
        <button className="btn-primary btn"
            onClick={this.handleToday.bind(this)}>
            Hoy
        </button>
        
        <button className="btn-primary btn"
            onClick={this.handleYesterday.bind(this)}>
            Día Anterior
        </button>

        <button className="btn-primary btn"
            onClick={this.handleLast7Days.bind(this)}>
            Últimos 7 días
        </button>

        <button className="btn-primary btn"
            onClick={this.handleLast30Days.bind(this)}>
            Últimos 30 días
        </button>
        <button className="btn-primary btn"
            onClick={this.handleNextMonth.bind(this, -1)}>
            Mes anterior
        </button>

        <button className="btn-primary btn"
            onClick={this.handleNextMonth.bind(this, 1)}>
            Mes siguiente
        </button>

      <div>
        <div className="date-range-picker-row">
            <p className="date-range-picker-row-label">Fecha Inicial:</p>
            <p className="date-range-picker-row-time">{this.props.start_date}</p>
        </div>
        <div className="date-range-picker-row">
            <p className="date-range-picker-row-label">Fecha Final:</p>
            <p className="date-range-picker-row-time">{this.props.end_date}</p>
        </div>
      </div>
    </div>

  }

}
