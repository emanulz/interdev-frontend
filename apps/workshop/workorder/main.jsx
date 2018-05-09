/*
 * Module dependencies
 */
import React from 'react'

//import subcomponents
import Content from './content/content.jsx'

import routes from './routes.js'
import {connect} from 'react-redux'

@connect((store)=>{
    return{
    }
})
export default class WorkOrder extends React.Component{

    componentWillMount(){

        this.props.dispatch({
            type: 'WORKSHOP_PANEL_MOUNTED', payload : ''
        })
        
    }


    //Main Lyaout
    render(){
        return <div className='Main heigh100'>
            {routes}
        </div>
    }

}