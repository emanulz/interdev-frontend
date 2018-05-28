/*
 * Module dependencies
 */
import React from 'react'


import Unauthorized from '../../../../general/unauthorized.jsx'
import {connect} from 'react-redux'

import Form from './form/form.jsx'

@connect((store) => {
    return {
        permissions: store.workorder.permissions
    }
  })
  export default class Create extends React.Component{
 
    //Main layout
    render(){

        let content = ''

        switch (this.props.permissions.add){
            case true:
            {
                content = <Form />
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

        return <div className='workshop-create heigh100'>
            <div className='create-edit-header'>
                <h1>CREAR ORDEN DE TRABAJO</h1>
                <span className='list fa fa-list' />
            </div>
            {content}
        </div>
    }

  }