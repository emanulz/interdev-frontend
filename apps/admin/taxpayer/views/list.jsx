import React from 'react'
import {connect} from 'react-redux'
import ListComponent from './list/list.jsx'
import Unauthorized from '../../../../general/unauthorized.jsx'



@connect(store=>{
    return {
        permissions: store.taxpayer.permissions,
    }
})
export default class List extends React.Component {


    render(){

        switch(this.props.permissions.list){
            case true:
            {
                content = <ListComponent/>
                break
            }
            case false:
            {
                content = <Unauthorized />
                break
            }
            default:
            {
                content = <div/>
                break
            }
        }

        return <div className='List'>
            {content}
        </div>

    }

}

