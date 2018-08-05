import React from 'react'
import {connect} from 'react-redux'
import {getSingleItemDispatch} from '../../../../utils/api.js'
import alertify from 'alertifyjs'

@connect(store =>{
    return {
        start_date: store.generalReports.start_date,
        end_date: store.generalReports.end_date,
    }
})
export default class ExcelFetcher extends React.Component {

    onStartDateChange(e){
        this.props.dispatch({type: 'SET_START_DATE', payload:e.target.value})
    }

    onEndDateChange(e){
        this.props.dispatch({type: 'SET_END_DATE', payload:e.target.value})
    }

    getReportStartEnd(report, e){

       //check if the start date is smaller than the end date
       if(this.props.start_date==='' || this.props.end_date ===''){
            alertify.alert('ERROR', `Se deben seleccionar ambas fechas`)
            return    
        }
        let start = new Date(this.props.start_date)
        let end = new Date(this.props.end_date)
        start = new Date( start.getTime() + start.getTimezoneOffset() * 60000 )
        end = new Date( end.getTime() + end.getTimezoneOffset() * 60000 )

        if(start > end){
            alertify.alert('ERROR', `La fecha inicial no puede ser posterior a la final`)
            return
        }
        const s_date = `${start.getFullYear()}-${start.getMonth()+1}-${start.getDate()}`
        const e_date = `${end.getFullYear()}-${end.getMonth()+1}-${end.getDate()}`
        return [s_date, e_date]

    }

    render(){

        const target_date = this.getReportStartEnd()
        const s = target_date[0]
        const e = target_date[1]

        return <div className="excel-fetcher" >
            <div className="excel-fetcher-title">
                <h1>Seleccione el periódo a reportar y descarge el Excel</h1>
            </div>
            <div className="excel-fetcher-dates">
                <div className="excel-fetcher-dates-item">
                    <label htmlFor="start-date">Fecha Inicial:</label>
                    <input type="date" name="start-date" 
                        onChange={this.onStartDateChange.bind(this)}
                        value={this.props.start_date}/>
                </div>

                <div className="excel-fetcher-dates-item">
                    <label htmlFor="end-date">Fecha Final:</label>
                    <input type="date" name="end-date"
                        onChange={this.onEndDateChange.bind(this)}
                        value={this.props.end_date}/>
                </div>
                <a href={`/reportsExcel/cashregister/?start=${s}&end=${e}`}>Cierre de Caja</a>
                <a href={`/reportsExcel/generalsales/?start=${s}&end=${e}`}>General Ventas</a>
                <a href={`/reportsExcel/generalpurchases/?start=${s}&end=${e}`}>General Compras</a>
                <a href="/reportsExcel/invvalue">Valoración de Inventario</a>
                <a href={`/reportsExcel/bdwarranty/?start=${s}&end=${e}`}>{"Garantías B&D"}</a>
                <a href={`/reportsExcel/cashregister/?start=${s}&end=${e}`}>Cierre de Caja</a>
            </div>

        </div>
    }
}

