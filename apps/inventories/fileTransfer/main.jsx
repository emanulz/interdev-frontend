import React from 'react'
import {connect} from 'react-redux'
import Content from './content/content.jsx'
import Search from '../../../general/search/search.jsx'
import Aside from './aside/aside.jsx'
import SingleProduct from './singleProduct.jsx'
import {productSearchDoubleClick, productSearchClick, productSearchActive} from '../../sales/general/search/actions.js'
import {loadGlobalConfig} from '../../../utils/api.js'
import {fecthProfile} from './actions'
const uuidv4 = require('uuid/v4')

@connect(store=>{
    return {

    }
})
export default class MakeMassFileTransfer extends React.Component {


    componentWillMount(){
        this.props.dispatch(fecthProfile())
        this.props.dispatch(
            loadGlobalConfig('global_conf', false, 'FETCH_GLOBAL_CONF_FULFILLED', 
                'FETCH_GLOBAL_CONF_REJECTED')
            )

        this.props.dispatch({type:'NEW_SALE'})

        this.props.dispatch({type:'SET_UNIQUE_ID', payload:uuidv4()})
        if(this.props.match.params.mode !== undefined){
            this.props.dispatch({type: 'SET_TRANSFER_MODE', payload: this.props.match.params.mode.toUpperCase()})
        }else{
            this.props.dispatch({type: 'SET_TRANSFER_MODE', payload: "FILE"})
        }
    }

    componentWillReceiveProps(next_props){
        if(this.props.match.params.mode != next_props.match.params.mode){
            if(next_props.match.params.mode !== undefined){
                this.props.dispatch({type: 'SET_TRANSFER_MODE', payload: next_props.match.params.mode.toUpperCase()})
                this.props.dispatch({type: "CLEAR_ALL"})
            }else{
                this.props.dispatch({type: 'SET_TRANSFER_MODE', payload: "FILE"})
            }
        }
    }

    render() {

        return <div className="sale">
        
            <Content />
            <Aside />
            <SingleProduct dontCheckInv/>
            <Search modelText='Producto' model='product' namespace='productSearch' onRowDoubleClick={productSearchDoubleClick}
                onRowClick={productSearchClick} onActiveItem={productSearchActive} sortedBy='code' useImage />
        
        </div>
    }
}