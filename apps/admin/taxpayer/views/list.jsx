import React from 'react'
import {connect} from 'react-redux'
import ListComponent from './list/list.jsx'
import Unauthorized from '../../../../general/unauthorized.jsx'



@connect(store=>{
    return {
        //permissions: store.taxpayer.permissions
    }
})
export default class List extends React.Component {


    render(){
        let content = 'LIST!'

        return <div>
            {content}
        </div>

    }

}

