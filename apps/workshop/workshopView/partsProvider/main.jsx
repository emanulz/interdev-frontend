import React from 'react'
import {connect} from 'react-redux'
import { getItemDispatch } from '../../../../utils/api'
import {checkUserPermissions} from '../../../../utils/checkPermissions'
import {userPartSearchRequest} from './actions.js'

let inspect = require('util-inspect')

@connect((store)=>{
    return{
        searchKey: store.partsProvider.searchKey,
        parts: store.partsProvider.parts,
        cashAdvanceList: store.transactionsList.cashAdvanceList,
        partsRequestList: store.transactionsList.partsRequestList,
        laborList: store.transactionsList.laborList
    }
})

export default class PartsProvider extends React.Component{

    componentWillMount(){

        this.fetchUserPermissions()
        //get the products data
        this.props.dispatch({type: 'FETCHING_STARTED', payload:''})
        this.props.dispatch({type:'CLEAR_PRODUCTS', payload:''})

        const productKwargs = {
            url: '/api/products',
            successType: 'FETCH_PRODUCTS_FULFILLED',
            errorType: 'FETCH_PRODUCTS_REJECTED'
        }
        this.props.dispatch(getItemDispatch(productKwargs))

    }

    inputKeyPress(e){
        if(e.key==='Enter'){
            if(e.target.value){
                //look for an accelerator for labor in the form
                //"mo*4500.00*Description"
                if(e.target.value.startsWith('mo*')){
                    let bits = e.target.value.split('*')
                    //check if the labor cost is not a number, notify
                    if(isNaN(bits[1])){
                        this.props.dispatch({type:'INVALID_LABOR_QUICK_ENTRY'})
                        return
                    }
                    const cost = parseFloat(bits[1])
                    let description = "Reparación"
                    if(!(bits[2] === undefined) && bits[2].length > 3){
                        description = bits[2]
                    }

                    this.props.dispatch({type:'ADD_TO_LABOR_LIST', 
                        payload: {'cost':cost, 'description':description}})

                    //signal the search field clear
                    this.props.dispatch({type:'CLEAR_SEARCH_KEY'})

                }else if(e.target.value.startsWith("ad*")){
                    let bits = e.target.value.split('*')
                    //check if the cost is not a number, notify
                    if(isNaN(bits[1])){
                        this.props.dispatch({type:'INVALID_CASH_ADVANCE_QUICK_ENTRY'})
                        return
                    }

                    const cost = parseFloat(bits[1])
                    let description = 'Adelando Reparación'
                    if(!(bits[2]===undefined) && bits[2].length > 3){
                        description = bits[2]
                    }

                    this.props.dispatch({type:'ADD_TO_CASH_ADVANCE_LIST',
                    payload:{'cost':cost, 'description':description}})

                    
                    //signal the search field clear
                    this.props.dispatch({type:'CLEAR_SEARCH_KEY'})

                }else{
                    let bits = e.target.value.split('*')
                    const code = bits[0]
                    const qty = isNaN(bits[1]) ? 1 : parseInt(bits[1])

                    //process user search request
                    const next_action = userPartSearchRequest(this.props.parts, code, qty, this.props.partsRequestList)
                    this.props.dispatch(next_action)
                    
                    //signal the search field clear
                    this.props.dispatch({type:'CLEAR_SEARCH_KEY'})
                    //signal the transactionsList with the code of the product
                }

            }
        }else{
            this.props.dispatch({type:'UPDATE_SEARCH_KEY', payload:e.target.value})
        }
    }

    render(){

        return <div className="parts">
            <div className="parts-inputs">
                <div className="parts-inputs-code">
                    <span className="fa fa-barcode"></span>
                    <input className="parts-inputs-code-input form-control input-lg"
                    placeholder="Ingrese el código del producto" type="text" 
                    value={this.props.searchKey} 
                    onKeyDown={this.inputKeyPress.bind(this)} 
                    onChange={this.inputKeyPress.bind(this)} />
                </div>
            </div>
        </div>
    }



    fetchUserPermissions(){
        const permissions = {
            add: 'workorders.add_workorder',
            change: 'workorders.change_workorder',
            list: 'workorders.list_workorder',
            delete: 'workorders.delete_workorder'
        }
    
        const kwargs = {
            permissions: permissions,
            success: 'FETCH_USER_WORKSHOPVIEW_PERMISSIONS_FULLFILLED',
            fail: 'FETCH_USER_WORKSHOPVIEW_PERMISSIONS_REJECTED'
        }
    
        this.props.dispatch({type: 'FETCHING_STARTED', payload:''})
        this.props.dispatch(checkUserPermissions(kwargs))
    }
    
}