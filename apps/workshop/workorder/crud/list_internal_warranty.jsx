import React from 'react'

import List_Warranty from './list_warranty/list.jsx'
import Unauthorized from '../../../../general/unauthorized.jsx'
import {connect} from 'react-redux'

@connect((store) => {
    return {
        permissions: store.workorder.permissions
    }
  })
  export default class List_Internal_Warranty extends React.Component{
 
    //Main layout
    render(){
        
        let content = ''

        switch (this.props.permissions.list){
            case true:
            {
                content = <List_Warranty />
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