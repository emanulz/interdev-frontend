import React from 'react'
import {connect} from 'react-redux'

@connect(store=>{
    return{
        report_uses_time: store.reports.show_detail.time_based,
        selected_period_type: store.reports.selected_period_type,
        report_date_range: store.reports.report_date_range,

        report_period_this: store.reports.report_period_this,
        report_date: store.reports.report_date,
        report_start_date: store.reports.report_start_date,
        report_end_date: store.reports.report_end_date

    }
})
export default class ReportPeriod extends React.Component {
    constructor(props){
        super(props)
    }

    reportDateChange(e){

    }

    setReportPeriodMethod(method, e){

    }


    buildReportReport(){
        // creates the request that must be made to the API to
        //obtain the method according to the report customization data entered
        console.log("Building report request and fetching report")
    }

    render (){
        //constructs an object to allow the user to 
        let uses_time = ''
        console.log("Reports uses time --> ", this.props.report_uses_time)
        if(this.props.report_uses_time){

            const time_pick_modes = <div className="report-time-modes">
            
                <div className={"report-time-modes-child" + selected_period_type=="THIS_MONTH" ? selected_period_type :""}
                 onClick={this.setReportPeriodMethod.bind(this, "THIS_MONTH")}>
                    <h2>Este Mes</h2>
                </div>
                <div className={"report-time-modes-child" + selected_period_type=="THIS_DAY" ? selected_period_type :""}
                 onClick={this.setReportPeriodMethod.bind(this, "THIS_DAY")}>
                    <h2>Hoy</h2>
                </div>
                <div className={"report-time-modes-child" + selected_period_type=="DATE_RANGE" ? selected_period_type :""}
                 onClick={this.setReportPeriodMethod.bind(this, "DATE_RANGE")}>
                    <h2>Por Rango</h2>
                </div>
                <div className={"report-time-modes-child" + selected_period_type=="DATE" ? selected_period_type :""}
                 onClick={this.setReportPeriodMethod.bind(this, "DATE")}>
                    <h2>Por Fecha</h2>
                </div>

            </div>

            //depending on the period entry mode select the period picker method
            let period_picker = ''
            switch(selected_period_type){
                case 'THIS_MONTH':
                {
                    console.log("Period this month")
                    break
                }
                case 'THIS_DAY':
                {
                    console.log("Period this day")
                    break
                }
                case 'DATE_RANGE':
                {
                    console.log("Mount range date picke")
                    break
                }
                case 'DATE':
                {
                    console.log("Mount specific date picker")
                    break
                }
            }
            
            const by_date = <div className="report-time-date">
                <input value={this.props.report_date}
                        className="report-time-point"
                        name='report_date' 
                        onChange={this.reportDateChange.bind(this)} 
                        type='date'/>
            </div>

            const by_range = <div className="report-time-range">
                <input value={this.props.report_date}
                            className="report-time-range-start"
                            name='report_date_start' 
                            onChange={this.reportDateChange.bind(this)} 
                            type='date'/>    
                <input value={this.props.report_date}
                            className="report-time-range-end"
                            name='report_date_end' 
                            onChange={this.reportDateChange.bind(this)} 
                            type='date'/>        
            </div>

            uses_time = <div className="report-time">
                {time_pick_modes}
            </div>
        }

        return uses_time
    }
}

