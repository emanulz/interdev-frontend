import React from 'react'
import {connect} from 'react-redux'
import {setItem, loadGlobalConfig} from '../../../utils/api'
import {supplierSearchDoubleClick} from '../general/suppliers/actions.js'

let inspect = require('util-inspect')

//components
import Content from './content/content.jsx'
import Aside from './aside/aside.jsx'
import PayPanel from './pay/payPanel.jsx'
import Search from '../../../general/search/search.jsx'
import { productSearchDoubleClick } from '../general/product/actions.js'

@connect(store=>{
    return {
    cartItems: store.purchase_cart.cartItems
    }
})
export default class Purchase extends React.Component {

    componentWillMount() {

        this.props.dispatch(loadGlobalConfig('inventory', 'sales_warehouse', 'FETCH_SALES_WAREHOUSE_FULFILLED', 'FETCH_SALES_WAREHOUSE_REJECTED'))
        this.props.dispatch(loadGlobalConfig('inventory', 'workshop_warehouse', 'FETCH_WORKSHOP_WAREHOUSE_FULFILLED', 'FETCH_WORKSHOP_WAREHOUSE_REJECTED'))
        
        const purchase_consecutive = this.props.location.pathname.split('/').pop()
        this.props.dispatch({type: 'PURCHASE_PANEL_MOUNTED'})
        this.props.dispatch({type: 'CLEAR_PURCHASE'})
        this.props.dispatch({type: 'CLEAR_CART'})
        if(this.props.isEdit){ 
            this.props.dispatch({type:'IS_PURCHASE_EDIT'})
            //load the instance from the db
            const kwargs = {
                lookUpField: 'consecutive',
                url: '/api/purchaselist/',
                lookUpValue: purchase_consecutive,
                dispatchType: 'LOADED_PURCHASE',
                dispatchType2: 'SET_OLD_PURCHASE',
                dispatchErrorType: 'PURCHASE_NOT_FOUND',
                lookUpName: 'Consecutivo de Compra',
                modelName: 'Compras'
            }
            this.props.dispatch({type: 'FETCHING_STARTED'})
            this.props.dispatch(setItem(kwargs))
        }
    }

    componentWillUnmount() {
        this.props.dispatch({type: 'CLEAR_PURCHASE'})
        this.props.dispatch({type: 'CLEAR_CART'})
    }

    render() {
        return <div className='purchase' >
            <Search modelText='Proveedor' model='supplier' namespace='supplierSearch' onRowDoubleClick = {supplierSearchDoubleClick}/>
            <Search modelText='Productos' model='product' namespace='productSearch' onRowDoubleClick={productSearchDoubleClick.bind({ cartItems: this.props.cartItems })} />
            <Content/>
            <Aside/>
            <PayPanel/>
        </div>
    }
}