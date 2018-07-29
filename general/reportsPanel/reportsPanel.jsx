import React from 'react'
import {connect} from 'react-redux'
import Panel from './panel.jsx'

@connect(store=>{
    return{

    }
})
export default class ReportsPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }


    render(){

        const cards = this.props.available_reports.map(re=>{
            return <Panel report_data={re}/>
        })

        return <div className="reports-panel">

            <h1>{this.props.title}</h1>
            <div className="reports-panel-mosaics-container">
                {cards}
            </div>

        </div>
    }
}

