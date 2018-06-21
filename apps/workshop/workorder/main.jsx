/*
 * Module dependencies
 */
import React from 'react'

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
            add: 'workshop.add_work_order',
            change: 'workshop.change_work_order',
            list: 'workshop.list_work_order',
            delete: 'workshop.delete_work_order'
        }

        const kwargs = {
            permissions: permissions,
            success: 'FETCH_USER_WORKSHOP_PERMISSIONS_FULLFILLED',
            fail: 'FETCH_USER_WORKSHOP_PERMISSIONS_REJECTED'
        }

        this.props.dispatch({type: 'FETCHING_STARTED', payload:''})
        this.props.dispatch(checkUserPermissions(kwargs))
        
    }


    //Main Lyaout
    render(){
        return <div className='Main heigh100'>
            {routes}
        </div>
    }

}