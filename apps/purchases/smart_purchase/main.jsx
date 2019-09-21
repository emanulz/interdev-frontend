import React from 'react'

import {connect} from 'react-redux'

import { loadGlobalConfig } from '../../../utils/api.js'

//components
import StepA from './step_a/main.jsx'
import StepB from './step_b/main.jsx'
import StepC from './step_c/main.jsx'
// import Search from '../../../general/search/search.jsx'

@connect(store=>{
    return {

    }
})
export default class SmartPurchase extends React.Component {

    componentWillMount(){
        this.props.dispatch(loadGlobalConfig('global_conf', false, 'FETCH_GLOBAL_CONF_FULFILLED', 'FETCH_GLOBAL_CONF_REJECTED'))
    }

    render() {
        return <div className='smart_purchase'>

            <StepA />
            <StepB />
            <StepC />
        </div>
    }
}