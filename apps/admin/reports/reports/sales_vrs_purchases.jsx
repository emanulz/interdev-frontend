import React from 'react'
import {connect} from 'react-redux'
import {getSingleItemDispatch} from '../../../../utils/api.js'
import AdminTable from '../../../../general/adminTable/adminTable.jsx'
import alertify from 'alertifyjs'

@connect(store=>{
    return {
        reportHeader: store.generalReports.reportHeader,
        reportPrettyData: store.generalReports.reportPrettyData,
        start_date: store.generalReports.start_date,
        end_date: store.generalReports.end_date,
    }
})
export default class PurchasesVrsSales extends React.Component {

    componentWillMount(){
        this.props.dispatch({type: 'FETCHING_STARTED'})
        //make an initial fetch for the current month
        const now = new Date()
        var month_first = new Date(now.getFullYear(), now.getMonth(), 1).getDate()
        var month_last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
        //http://dante/api/reporting/getReportVisualizationData/?report=salesvrspurchases&start=2018-06-1&end=2018-06-30

        this.props.dispatch({type: 'SET_START_DATE', payload: `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,"0")}-${month_first.toString().padStart(2, "0")}`})
        this.props.dispatch({type: 'SET_END_DATE', payload: `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,"0")}-${month_last.toString().padStart(2,"0")}`})

        const start_date = `${now.getFullYear()}-${now.getMonth()+1}-${month_first}`
        const end_date = `${now.getFullYear()}-${now.getMonth()+1}-${month_last}`
        //let url = `/api/reporting/getReportVisualizationData/?report=salesvrspurchases&start=`
        let url = `/api/reporting/getReportVisualizationData/?report=utilitiesreport&start=`
        url += `${start_date}&end=${end_date}`
        const kwargs = {
            url: url,
            successType: 'PURCHASES_VRS_SALES_FETCHED',
            errorType: 'PURCHASES_VRS_SALES_REJECTED'
        }
        this.props.dispatch(getSingleItemDispatch(kwargs))
    }
    
    onStartDateChange(e){
        this.props.dispatch({type: 'SET_START_DATE', payload:e.target.value})
    }

    onEndDateChange(e){
        this.props.dispatch({type: 'SET_END_DATE', payload:e.target.value})
    }

    updateReportData(e){
        //check if the start date is smaller than the end date
        if(this.props.start_date==='' || this.props.end_date ===''){
            alertify.alert('ERROR', `Se deben seleccionar ambas fechas`)
            return    
        }

        const start = new Date(this.props.start_date)
        const end = new Date(this.props.end_date)
        if(start > end){
            alertify.alert('ERROR', `La fecha inicial no puede ser posterior a la final`)
            return
        }
        const s_date = `${start.getFullYear()}-${start.getMonth()+1}-${start.getDate()}`
        const e_date = `${end.getFullYear()}-${end.getMonth()+1}-${end.getDate()}`

        let url = `/api/reporting/getReportVisualizationData/?report=salesvrspurchases&start=`
        url += `${s_date}&end=${e_date}`
        const kwargs = {
            url: url,
            successType: 'PURCHASES_VRS_SALES_FETCHED',
            errorType: 'PURCHASES_VRS_SALES_REJECTED'
        }
        this.props.dispatch(getSingleItemDispatch(kwargs))

    }

    render(){

        const header = this.props.reportHeader;
        //build the table header
        
        let content = ''
        if(header != undefined){
            const headerOrder = [
                {
                    field: 'date',
                    text: header[0],
                },
                {
                    field: 'sale_subtotal',
                    text:  header[1],
                    type: 'price'
                },
                {
                    field: 'sale_tax',
                    text: header[2],
                    type: 'price'
                },
                {
                    field: 'sale_total',
                    text: header[3],
                    //type: 'price'
                },
                {
                    field: 'purchase_subtotal',
                    text: header[4],
                    type: 'price'
                },
                {
                    field: 'purchase_tax',
                    text: header[5],
                    type: 'price'
                },
                // {
                //     field: 'purchase_total',
                //     text: header[6],
                //     type: 'price'
                // }
            ]
            content = <AdminTable headerOrder={headerOrder} 
                data={this.props.reportPrettyData} app="none" model="none"/>
        }
    
        return <div className="sales-purchases">

            <div className="sales-purchases-title">
                <h1>Reporte de Compras y Ventas</h1>
            </div>

            <div className="sales-purchases-dates">
                <div className="sales-purchases-dates-item">
                    <label htmlFor="start-date">Fecha Inicial:</label>
                    <input type="date" name="start-date" 
                        onChange={this.onStartDateChange.bind(this)}
                        value={this.props.start_date}/>
                </div>

                <div className="sales-purchases-dates-item">
                    <label htmlFor="end-date">Fecha Final:</label>
                    <input type="date" name="end-date"
                        onChange={this.onEndDateChange.bind(this)}
                        value={this.props.end_date}/>
                </div>
                <button className="form-control btn-primary"  onClick={this.updateReportData.bind(this)}>Actualizar reporte</button>
            </div>
            
            {content}
       </div>

    }
}