/*
 * Module dependencies
 */
import React from 'react'

import {setItem, getSingleItemDispatch, loadGlobalConfig} from '../../../../utils/api.js'
import Unauthorized from '../../../../general/unauthorized.jsx'
import {connect} from 'react-redux'
import Form from './form/form.jsx'
import Search from '../../../../general/search/search.jsx'
import ClientCreatePanel from '../../../../general/clientCreatePanel/clientCreatePanel.jsx'
import {clientSearchDoubleClick} from '../../general/clients/actions'


@connect((store) => {
    return {
        permissions: store.workorder.permissions,
        is_edit: store.workorder.is_edit,
        work_order: store.workorder.work_order,
    }
  })
  export default class Create extends React.Component{
    

    componentWillMount(){

        this.props.dispatch({type: 'CLEAR_WORK_ORDER'})
        const work_order_consecutive = this.props.location.pathname.split('/').pop()
        if(isFinite(work_order_consecutive)){
            console.log("Is a number, edit the crap out of it")
            const kwargs = {
                lookUpField: 'consecutive',
                url: '/api/listworkorders/',
                lookUpValue: work_order_consecutive,
                dispatchType: 'WORK_ORDER_EDIT_LOADED',
                dispatchErrorType: 'WORK_ORDER_NOT_FOUND',
                lookUpName: 'consecutivo orden',
                modelName: 'Orden de trabajo'
            }
            this.props.dispatch({type:'FETCHING_STARTED'})
            //load work order
            this.props.dispatch(setItem(kwargs))

        }
    }

    render(){

        let content = ''

        switch (this.props.permissions.add){
            case true:
            {
                content = <div>
                    <Search modelText='Cliente' model='client' namespace='clientSearch' onRowDoubleClick={clientSearchDoubleClick}/>
                    <Form />
                    <ClientCreatePanel/>
                </div> 
                break
            }
            case false:
            {
                content = <Unauthorized />
                break
            }
            default:
            {
                content = <div></div>
            }
        }
        //header label
        const main_header = this.props.is_edit ? 'EDITAR ORDEN DE TRABAJO' : 'CREAR ORDEN DE TRABAJO'
        return <div className='workshop-create heigh100'>
            <div className='create-edit-header'>
                <h1>{main_header}</h1>
                <span className='list fa fa-list' />
            </div>
            {content}
        </div>
    }

  }