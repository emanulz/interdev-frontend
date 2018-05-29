import React from 'react'
import {connect} from 'react-redux'

@connect(store=>{
    return {
        //permissions: store.suppliers.permissions
    }
})
export default class Payment extends React.Component {
    componentWillMount() {
        
    }

    render(){
        return <h1>Payment </h1>
    }
}