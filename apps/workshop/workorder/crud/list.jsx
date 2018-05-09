/*
 * Module dependencies
 */
import React from 'react'

import ListComponent from './list/list.jsx'
import Unauthorized from '../../../../general/unauthorized.jsx'
import {connect} from 'react-redux'

@connect((store) => {
    return {
        permissions: store.workorder.permissions
    }
  })
  export default class List extends React.Component{
 
    //Main layout
    render(){
        
        let content = ''

        switch (this.props.permissions.list){
            case true:
            {
                content = <ListComponent />
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

        return <div className='List'>
            {content}
        </div>
    }

  }