import React from 'react'
import {connect} from 'react-redux'
import {checkUserPermissions} from '../../../../utils/checkPermissions'
import {buildCashAdvanceRequest, buildLaborRequest, 
    buildUsedPartRequest, searchProduct, buildInformativeMov} from './actions.js'


let inspect = require('util-inspect')

@connect((store)=>{
    return{
        searchKey: store.partsProvider.searchKey,
        parts: store.partsProvider.parts,
        cashAdvanceList: store.transactionsList.cashAdvanceList,
        partsRequestList: store.transactionsList.partsRequestList,
        laborList: store.transactionsList.laborList,
        informativeList: store.transactionsList.informativeList,
        is_closed: store.workshopview.work_order.is_closed,
        sales_warehouse: store.transactionsList.sales_warehouse
    }
})

export default class PartsProvider extends React.Component{

    componentWillMount(){

        this.fetchUserPermissions()
        //get the products data
        this.props.dispatch({type: 'FETCHING_STARTED', payload:''})

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
                    const amount = parseFloat(bits[1])
                    let description = "Reparación"
                    if(!(bits[2] === undefined) && bits[2].length > 3){
                        description = bits[2]
                    }

                    this.props.dispatch(buildLaborRequest(amount, description))

                    //signal the search field clear
                    this.props.dispatch({type:'CLEAR_SEARCH_KEY'})

                }else if(e.target.value.startsWith("ad*")){
                    let bits = e.target.value.split('*')
                    //check if the cost is not a number, notify
                    if(isNaN(bits[1])){
                        this.props.dispatch({type:'INVALID_CASH_ADVANCE_QUICK_ENTRY'})
                        return
                    }

                    const amount = parseFloat(bits[1])
                    let description = 'Adelando Reparación'
                    if(!(bits[2]===undefined) && bits[2].length > 3){
                        description = bits[2]
                    }

                    this.props.dispatch(buildCashAdvanceRequest(amount, description))

                    //signal the search field clear
                    this.props.dispatch({type:'CLEAR_SEARCH_KEY'})
                }else if(e.target.value.startsWith("re*")){
                    let bits = e.target.value.split("*")
                    //check if the cost is a number
                    if(isNaN(bits[1])){
                        this.props.dispatch({type:'INVALID_USED_PART_QUICK_ENTRY'})
                        return
                    }

                    const amount = parseFloat(bits[1])
                    let description = 'Repuesto usado de taller'
                    if(!(bits[2]===undefined) && bits[2].length > 3){
                        description = bits[2]
                    }

                    this.props.dispatch(buildUsedPartRequest(amount, description))
                    //signal the search field clear
                    this.props.dispatch({type:'CLEAR_SEARCH_KEY'})

                }else if(e.target.value.startsWith("in*")){
                    let bits = e.target.value.split("*")
                    let description = bits[1]
                    this.props.dispatch(buildInformativeMov(description))
                    this.props.dispatch({type: 'CLEAR_SEARCH_KEY'})
                }else{
                    let bits = e.target.value.split('*')
                    const code = bits[0]
                    const qty = isNaN(bits[1]) ? 1 : parseInt(bits[1])
                    this.props.dispatch(searchProduct(code, 'product', 'productSearch', qty, this.props.partsRequestList, this.props.sales_warehouse))
                    this.props.dispatch({type:'CLEAR_SEARCH_KEY'})

                }

            }
        }else{
            this.props.dispatch({type:'UPDATE_SEARCH_KEY', payload:e.target.value})
        }
    }

    searchProductClick(e){
        this.props.dispatch({type: 'productSearch_TOGGLE_SEARCH_PANEL'})
    }

    render(){

        return <div className="parts">
            <div className="parts-inputs">
                <div className="parts-inputs-code">
                    <span className="fa fa-barcode"></span>
                    <input className="parts-inputs-code-input form-control input-lg"
                    id='parts-input-code-input'
                    placeholder="Ingrese el código del producto" type="text" 
                    disabled={this.props.is_closed}
                    value={this.props.searchKey} 
                    onKeyDown={this.inputKeyPress.bind(this)} 
                    onChange={this.inputKeyPress.bind(this)} />
                </div>
                <button disabled={this.props.disabled} onClick={this.searchProductClick.bind(this)}
                className='parts-inputs-search'>
                    <span>
                        <i className='fa fa-search' />
                    </span>
                </button>
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