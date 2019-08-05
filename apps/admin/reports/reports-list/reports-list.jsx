import React from 'react'
import { connect } from 'react-redux'
import alertify from 'alertifyjs'
import AdminTable from '../../../../general/adminTable/adminTable.jsx'
import { getPaginationItemDispatch, getItemReturn } from '../../../../utils/api.js'
import Pagination from '../../../../general/pagination/pagination.jsx'
import ResultsPerPage from '../../../../general/pagination/resultsPerPage.jsx'
import ReportRequestPanelComponent  from '../reports/reportRequestPanel.jsx'
import ResendEmailPanelComponent from '../reports/resendEmailPanel.jsx'


@connect((store) => {
    return {
        fething: store.fetching.fetching,
        report_records: store.generalReports.report_records,
        report_type_filter: store.generalReports.report_type_filter,
        pageSize: store.pagination.pageSize,
        searchResults: store.adminSearch.searchResults,
        start_date: store.generalReports.start_date,
        end_date: store.generalReports.end_date,
        refetch_reports: store.generalReports.refetch_reports
    }
})
export default class ReportsListComponent extends React.Component {

    componentWillMount() {

      this._fetchReports()

    }

    componentWillReceiveProps(nextProps){
      if(nextProps.refetch_reports & !this.props.refetch_reports){
        this._fetchReports()
      }
    }


    _fetchReports(){
      this.props.dispatch({type: 'FETCHING_STARTED'})

      const reportsKwargs = {
          url: `/api/asyncreportinglist/?limit=${this.props.pageSize}&ordering=-id`,
          successType: 'FETCH_REPORT_RECORDS_FULFILLED',
          errorType: 'FETCH_REPORT_RECORDS_REJECTED'
      }

      this.props.dispatch(getPaginationItemDispatch(reportsKwargs))
    }

    getTipoReporteName(type){
      console.log("Report ID type --> ", type)
        const types = {
            0: "GENERAL VENTAS",
            1: "GENERAL COMPRAS"
        }

        return types[+type] ? types[type] : "DESCONOCIDO"

    }

    onCancel(){
      this.props.dispatch({type: "TOGGLE_REPORT_REQUEST_PANEL"})
    }


    onResend(el){
      this.props.dispatch({type: 'SET_MAILING_TARGET', payload: el})
      this.props.dispatch({type: 'TOGGLE_REPORT_MAILING_PANEL'})
    }

    render() {


        const headerOrder = [
            {
              field: 'id',
              text: 'Consecutivo',
              type: 'primary'
            }, {
              field: 'tipo_reporte',
              text: 'Tipo'
            }, {
              field: 'start_date',
              text: 'Fecha Inicial',
              type: 'date'
            }, {
              field: 'end_date',
              text: 'Fecha Final',
              type: 'date'
            }, {
              field: 'ready',
              text: 'Generado?',
              type: 'bool'
            },
            {
              field: 'created',
              text: 'Fecha Generación',
              type: 'date'
            },
            {
              field: 'id',
              text: 'Descargar?',
              textToRender: 'Descargar',
              baseLink: '/api/asyncreporting/get_reportfile',
              fieldAsParams: [{field: 'id', name:'id'}],
              type: 'link_params'
            },
            {
              field: 'id',
              text: 'Enviar Correo?',
              textToRender: 'Enviar',
              onClickFunction: this.onResend,
              type: 'function_on_click_pass_element'
            },
        ]
        
        const paginationDiv = !this.props.searchResults.length
        ? <div className='admin-list-results-pagination' >
          <ResultsPerPage url='/api/asyncreportinglist/?ordering=-id' successType='FETCH_REPORT_RECORDS_FULFILLED' errorType='FETCH_REPORT_RECORDS_REJECTED' />
          <Pagination url='/api/asyncreportinglist/?ordering=-id' successType='FETCH_REPORT_RECORDS_FULFILLED' errorType='FETCH_REPORT_RECORDS_REJECTED' />
        </div>
        : <div />

        const fetching = <div/>
        let tableData = this.props.report_records ? this.props.report_records : []
        //if the table data is not empty post process it for visualization
        tableData.map(el => {
            //take care of type report enum
            if(!isNaN(el['tipo_reporte'])){
              el['tipo_reporte'] = this.getTipoReporteName(el['tipo_reporte'])
            }
            return el
        })
        
        const list = <AdminTable headerOrder={headerOrder} model='report_record' data={tableData}
        idField='id' />

        const requestPanel = <ReportRequestPanelComponent></ReportRequestPanelComponent>
        const mailingPanel = <ResendEmailPanelComponent></ResendEmailPanelComponent>
        return <div className='List'>
            {requestPanel}
            {mailingPanel}
            <button onClick={this.onCancel.bind(this)}
                    className='btn btn-success'>
                      NUEVO REPORTE
                    <span>
                        <i className='fa fa-plus' />
                    </span>
                </button>
            {paginationDiv}
            {list}
        </div>
    }
}