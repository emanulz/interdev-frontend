import React from 'react'
import {connect} from 'react-redux'
import ReportsPanel from '../../../general/reportsPanel/reportsPanel.jsx'
import {getSingleItemDispatch} from '../../../utils/api.js'

@connect(store=>{
    return {
        reports_definitions: store.reports.reports_definitions,
    }
})


export default class Reports extends React.Component {


    componentWillMount() {
        this.props.dispatch({type:'FETCHING_STARTED'})
        const kwargs = {
            url: '/api/reporting/getDefinitions/',
            successType: 'REPORTS_DEFINITIONS_FETCHED',
            errorType: 'REPORTS_DEFINITIONS_REJECTED'
        }
        this.props.dispatch(getSingleItemDispatch(kwargs))
    }

    render() {
        //to be used while the data is retrieved
        const fetching = <div/>
        const app_specific_reports = this.props.reports_definitions.inventory

        let panel=''
        if(this.props.reports_definitions.inventory != undefined){
            console.log(this.props.reports_definitions.inventory)
            panel = <ReportsPanel title={'Listado Reportes Disponibles'} available_reports={app_specific_reports}/>
        }
        
        const content = this.props.reports_definitions.inventory != undefined ? panel : fetching
        return <div className='Main heigh100' >
            {content}
        </div>

    }

}