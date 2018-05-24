import React from 'react'
import {connect} from 'react-redux'

//components
import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'
import PayPanel from './pay/payPanel.jsx'

@connect(store=>{
    return {
    }
})
export default class Purchase extends React.Component {

    componentWillMount() {
        this.props.dispatch({type: 'PURCHASE_PANEL_MOUNTED', payload: ''})
    }

    render() {
        return <div className='purchase' >
            <Content/>
            <Aside/>
            <PayPanel/>
        </div>
    }
}