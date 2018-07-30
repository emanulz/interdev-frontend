import React from 'react'
import {connect} from 'react-redux'

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

    onPanelClick(data, e){
        this.props.dispatch({type: 'SET_SELECTED_REPORT', payload: data})
    }

    render(){
        const base_class = "mosaic-panel"
        const rep_data = this.props.report_data
        //check if an icon class was sent
        let icon_element = ''
        if(rep_data.icon_class!=undefined){
            icon_element = <i className={rep_data.icon_class + base_class+"-icon"}  ></i>
        }

        return <div className="mosaic-panel" onClick={this.onPanelClick.bind(this, rep_data)}>

            <h3>{icon_element}{rep_data.name}</h3>
            <p className={base_class+"-description"} >{rep_data.description}</p>
            

        </div>
    }
}
