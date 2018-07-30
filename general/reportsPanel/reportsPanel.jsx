import React from 'react'
import {connect} from 'react-redux'
import Panel from './panel.jsx'
import ReportDetail from './reportDetail.jsx'

@connect(store=>{
    return{
        show_detail: store.reports.show_detail,
    }
})
export default class ReportsPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }



    render(){
        let content = ''
        if(this.props.show_detail != undefined){
            content = <div className="reports-panel-detail">
                <ReportDetail data={this.props.show_detail}/>
            </div>
        }else{
            const cards = this.props.available_reports.map(re=>{
                return <Panel report_data={re}/>
            })
            content = <div className="reports-panel-list">
                <div className="reports-panel-list-title">
                    
                    <h1> {this.props.title}</h1>
                </div>
                <div className="reports-panel-list-mosaics-container">
                    {cards}
                </div>
            </div>

        }



        return <div className="reports-panel">        
            {content}
        </div>
    }
}

