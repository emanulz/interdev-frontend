import React from 'react'
import {connect} from 'react-redux'

import ReportFormats from './components/availableFormats.jsx'
import ReportPeriod from './components/reportPeriod.jsx'

@connect(store=>{
    return {
        report_request: store.reports.report_request,
        show_detail: store.reports.show_detail,

    }
})
export default class ReportDetail extends React.Component {
    constructor(props){
        super(props)
    }

    clearReportDetail(e){
        this.props.dispatch({type: 'SET_SELECTED_REPORT', payload:undefined})
    }
    render(){

        const back_to_mosaic = <button className="btn btn-rounded btn-success to-mosaic-button" onClick={this.clearReportDetail.bind(this)}>
            Regresar a Mosaico Reportes
        </button>
        const data = this.props.data

        let custom_actions =''
        data.custom_actions ?
            custom_actions = data.custom_actions.map(a=>{
                return <div>Action ->{a.name}</div>

            })
        : ''

        return <div className="report-detail">
                <div className="report-detail-title">
                    {back_to_mosaic}
                    <h1>{"Detalle "+this.props.show_detail.name}</h1>
                </div>

            <div className="report-detail-description">
                <h1>{data.description ? data.description : ''}</h1>
            </div>
            <div className="report-detail-actions">
                <ReportFormats/>
                <ReportPeriod/>
              
            </div>

            <div className="report-detail-custom">
                {custom_actions ? custom_actions : ''}
            </div>

        </div>
    }
}