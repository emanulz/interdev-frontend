/*
 * Module dependencies
 */
import React from 'react'

//import subcomponents
import Content from './content/content.jsx'

import routes from './routes.js'
import {connect} from 'react-redux'
import { checkUserPermissions } from '../../../utils/checkPermissions';

@connect((store)=>{
    return{
        permissions : store.workorder.permissions
    }
})
export default class WorkOrder extends React.Component{

    componentWillMount(){

        const permissions = {
            add: 'workorders.add_workorder',
            change: 'workorders.change_workorder',
            list: 'workorders.list_workorder',
            delete: 'workorders.delete_workorder'
        }

        const kwargs = {
            permissions: permissions,
            success: 'FETCH_USER_WORKSHOP_PERMISSIONS_FULLFILLED',
            fail: 'FETCH_USER_WORKSHOP_PERMISSIONS_REJECTED'
        }

        this.props.dispatch({type: 'FETCHING_STARTED', payload:''})
        this.props.dispatch(checkUserPermissions(kwargs))
        

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