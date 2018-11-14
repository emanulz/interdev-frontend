import React from 'react'
import {connect} from 'react-redux'
import Picker from './loadFromFile/picker.jsx'
import {loadGlobalConfig} from '../../../utils/api.js'

import TransferContent from './content/main.jsx'
import Aside from './aside/main.jsx'

@connect(store=>{
    return {

    }
})
export default class FileTransferLoader extends React.Component {


    componentWillMount(){
        this.props.dispatch(loadGlobalConfig('global_conf', false, 'FETCH_GLOBAL_CONF_FULFILLED', 'FETCH_GLOBAL_CONF_REJECTED'))
        
    }

    render(){

        return <div className="transfer-view">
        
            <div className="transfer-view-header">

                <h1>Transferencia de inventario por archivo</h1>
                <Picker />
            
            </div>
            <TransferContent/>
            <Aside />

        </div>
    }
}