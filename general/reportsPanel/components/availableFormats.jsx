import React from 'react'
import {connect} from 'react-redux'

@connect(store=>{
    return{
        show_detail: store.reports.show_detail,
        selected_report_format: store.reports.selected_report_format,
    }
})
export default class ReportFormats extends React.Component {
    
    constructor(props){
        super(props)
        this.state={
            
        }
    }

    setFormatEnabled(format, e){
        this.props.dispatch({type:'TOGGLE_FORMAT_SELECTED', payload: format})
    }

    render() {
        //build a box for each selected report type
        const formats = this.props.show_detail.formats.map(r =>{
            let target_class = "available-formats-format"
            const index = this.props.selected_report_format.findIndex(a => a===r)
            if(index !==-1){
                target_class+="-selected"
            }

            return <div className={target_class} 
            onClick={this.setFormatEnabled.bind(this, r)}>
                <p>{r}</p>
            </div>
        })
        return <div className="available-formats">
            <h2 className="available-formats-header" >Seleccione los formatos requeridos</h2>
            {formats}
        </div>
    }
}