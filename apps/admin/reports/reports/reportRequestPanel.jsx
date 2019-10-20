import React from 'react'
import { connect } from 'react-redux'
import { generalSave } from '../../../../utils/api.js'
import alertify from 'alertifyjs'

@connect(store=>{
    return {
        start_date: store.generalReports.start_date,
        end_date: store.generalReports.end_date,
        is_visible: store.generalReports.report_request_panel_visible,
        report_to_generate: store.generalReports.report_to_generate,
        notify_emails: store.generalReports.notify_emails
    }
})
export default class ReportRequestPanelComponent extends React.Component {



    componentWillMount(){

    }

    onReportRequest(){
        switch(this.props.report_to_generate){
            case 'General Ventas':
            {
                this.queueGeneralSales()
                break
            }
            case 'General Compras':
            {
                this.queueGeneralPurchases()
                break   
            }
            case 'D151 Ventas':
                this.queueD151()
                break
        }
    }

    onCancel(){
        this.props.dispatch({type: "TOGGLE_REPORT_REQUEST_PANEL"})
    }

    onStartDateChange(e) {

        let minimum_date = new Date('2019-08-01')
        let start = new Date(e.target.value)
        if(start < minimum_date){
            alertify.alert('ERROR', `Los reportes IVA deben tener fecha Inicial mínima de 1 JULIO 2019`)
            return 
        }
        let end = new Date(this.props.end_date)
        start = new Date(start.getTime() + start.getTimezoneOffset() * 60000)
        end = new Date(end.getTime() + end.getTimezoneOffset() * 60000)
    
        if (start > end) {
          alertify.alert('ERROR', `La fecha inicial no puede ser posterior a la final`)
          return
        }
    
        if (isNaN(start.getTime())) {
          alertify.alert('ERROR', `Por favor use el selector de fecha y seleccione una fecha válida`)
          return
        }
    
        this.props.dispatch({ type: 'SET_START_DATE', payload: e.target.value })
      }
    
    onEndDateChange(e) {
        let minimum_date = new Date('2019-08-01')
        let start = new Date(this.props.start_date)
        let end = new Date(e.target.value)
        if(end < minimum_date){
            alertify.alert('ERROR', `Los reportes IVA deben tener fecha Inicial mínima de 1 JULIO 2019`)
            return 
        }
        start = new Date(start.getTime() + start.getTimezoneOffset() * 60000)
        end = new Date(end.getTime() + end.getTimezoneOffset() * 60000)

        if (start > end) {
            alertify.alert('ERROR', `La fecha Final no puede ser anerior a la Inicial`)
            return
        }

        if (isNaN(end.getTime())) {
            alertify.alert('ERROR', `Por favor use el selector de fecha y seleccione una fecha válida`)
            return
        }
        this.props.dispatch({ type: 'SET_END_DATE', payload: e.target.value })
    }

    queueGeneralSales(){
        //requests to the backend the creation of a sales report with the given information
        //on the panel
        this._checkDates(true, true)
        const data = {
            report: {
                tipo_reporte: 0,
                start_date: this.props.start_date,
                end_date: this.props.end_date,
                notify_emails: this.props.notify_emails ? this.props.notify_emails : "",
            }
        }

        const kwargs = {
            data: data,
            url: '/api/asyncreporting/',
            method: 'post',
            successType: 'NEW_REPORT_QUEUED',
            errorType: 'ERROR_QUEING_REPORT',
            sucessMessage: "Generación reporte agendada. Regrese en unos minutos por el reporte.",
            errorMessage: "Error agendando reporte. Revise la información e intente de nuevo."

        }
        this.props.dispatch(generalSave(kwargs))

    }

    queueGeneralPurchases(){
        //requests to the backend the creation of a purchases report with the given information
        //on the panel
        this._checkDates(true, true)
        const data = {
            report: {
                tipo_reporte: 1,
                start_date: this.props.start_date,
                end_date: this.props.end_date,
                notify_emails: this.props.notify_emails ? this.props.notify_emails : "",
            }
        }

        const kwargs = {
            data: data,
            url: '/api/asyncreporting/',
            method: 'post',
            successType: 'NEW_REPORT_QUEUED',
            errorType: 'ERROR_QUEING_REPORT',
            sucessMessage: "Generación reporte agendada. Regrese en unos minutos por el reporte.",
            errorMessage: "Error agendando reporte. Revise la información e intente de nuevo."

        }
        this.props.dispatch(generalSave(kwargs))
    }

    queueD151(){
        this._checkDates(true, true)
        const data = {
            report: {
                tipo_reporte: 2,
                start_date: this.props.start_date,
                end_date: this.props.end_date,
                notify_emails: this.props.notify_emails ? this.props.notify_emails : "",
            }
        }

        const kwargs = {
            data: data,
            url: '/api/asyncreporting/',
            method: 'post',
            successType: 'NEW_REPORT_QUEUED',
            errorType: 'ERROR_QUEING_REPORT',
            sucessMessage: "Generación reporte agendada. Regrese en unos minutos por el reporte.",
            errorMessage: "Error agendando reporte. Revise la información e intente de nuevo."

        }
        this.props.dispatch(generalSave(kwargs))
    }

    queueInvValue(){
        //requests to the backend the creation of a purchases report with the given information
        //on the panel
        console.log("MAKE ME An INV VALUE!")
    }

    available_reports = [
        {name: "General Ventas", "enumCode": 0, controls: ["start_date", "end_date"], method: this.queueGeneralSales},   
        {name: "General Compras", "enumCode": 1, controls: ["start_date", "end_date"], method: this.queueGeneralPurchases},
        {name: "D151 Ventas", "enumCode": 2, controls: ["start_date", "end_date"], method: this.queueD151}
        // {name: "Valoración Inventario", "enumCode": 2, controls: ["warehouse"], method: this.queueInvValue}  
       ]

    setToGenerateType(report_type){
        this.props.dispatch({type: 'SET_REPORT_TYPE_TO_QUEUE', payload: report_type})
    }


    _checkDates(needs_start, needs_end){
        let notify_start = false
        let notify_end = false
        if(needs_start){
            if(this.props.start_date === "" || this.props.start_date === undefined){
                notify_start = true
            }
        }

        if(needs_end){
            if(this.props.end_date === "" || this.props.end_date === undefined){
                notify_end = true
            }
        }

        if(notify_start && notify_end){
            alertify.alert('ERROR', 'Se debe seleccionar la Fecha Inicial y Final antes de continuar')
            return
        }

        if(notify_start){
            alertify.alert('ERROR', 'Se debe seleccionar la Fecha Inicial antes de continuar')
            return
        }
        if(notify_end){
            alertify.alert('ERROR', 'Se debe seleccionar la Fecha Final antes de continuar')
            return
        }

    }

    _buildAvailableReportsListing(){
        //builds a selector for the diffeerent type of reports that can be built
        let report_buttons = <div>No hay reportes disponibles</div>
        let counter = 0
        report_buttons = this.available_reports.map(el => {
            let className = "rep-req-body-options-button"
            if(el.name === this.props.report_to_generate){
                className += "-selected"
            }
            counter += 1
            return <div className={className} onClick={this.setToGenerateType.bind(this, el.name)} key={`rep_btn_${counter}`}>
                {el.name}
            </div>
        })

        return report_buttons
    }


    _onNotifyEmailsChange(e){
        this.props.dispatch({type: 'SET_NOTIFY_EMAILS', payload: e.target.value})
    }


    render(){

        const report_settings = this.available_reports.find(el=>{
            return el.name === this.props.report_to_generate
        })

        const report_options = this._buildAvailableReportsListing()

        let start_date = ''
        let end_date = ''

        if(report_settings){
            //find wich controls to display
            report_settings.controls.forEach(el=>{
                switch(el){
                    case 'start_date':
                        {
                        start_date = <div className='excel-fetcher-dates-item'>
                            <label htmlFor='start-date'>Fecha Inicial:</label>
                            <input type='date' name='start-date'
                                onChange={this.onStartDateChange.bind(this)}
                                value={this.props.start_date} />
                            </div>
                        break
                        }
                    case 'end_date':
                        {
                        end_date = <div className='excel-fetcher-dates-item'>
                            <label htmlFor='end-date'>Fecha Final:</label>
                            <input type='date' name='end-date'
                                onChange={this.onEndDateChange.bind(this)}
                                value={this.props.end_date} />
                            </div>
                            break
                        }

                }
            })
        }else{
            console.log("Report type not supported")
        }


        
        let range_container = ''
        if(start_date!== '' || end_date !== ''){
            range_container = <div>
                <h2 className="rep-req-body-title-2">Seleccione el rango del reporte</h2>
                <div className="rep-req-body-dates">
                    {start_date}
                    {end_date}
                </div>

            </div>
        }

        

        const panel_root_class = this.props.is_visible===true ? 'rep-req' : 'rep-panel-hidden'
        return <div className={panel_root_class}>
            <div className="rep-req-body">
                
                <h1 className="rep-req-body-title">Solicitar Generación Reporte</h1>
           
                <p className="rep-req-body-legend">Una vez confirmada la solicitud, el reporte se agregará a la 
                    cola de generación, revisar en unos minutos.</p>

                <div className="rep-req-body-title-2">Seleccione el tipo de reporte a generar</div>
                <div className="rep-req-body-options">
                    {report_options}
                </div>
                   
                {range_container}

                <div className="rep-req-body-email">
                    <div className="rep-req-body-title-2">Enviar reporte a correos, lista separada por comas:</div>
                    <input type="text" className="form-control rep-req-body-email-input" 
                    value={this.props.notify_emails}
                    onChange={this._onNotifyEmailsChange.bind(this)}/>
                </div>

                <div className="rep-req-body-actions">
                    <button onClick={this.onReportRequest.bind(this)}
                        className='btn btn-success rep-req-body-actions-btn'>
                            GENERAR REPORTE
                    </button>
                    <button onClick={this.onCancel.bind(this)}
                        className='btn btn-danger rep-req-body-actions-btn'>
                            CANCELAR
                        <span>
                            <i className='fa fa-cross' />
                        </span>
                    </button>
                </div>
            </div>

        </div>
    }
}