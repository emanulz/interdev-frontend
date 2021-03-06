import React from 'react'
import {connect} from 'react-redux'

import PartsProvider from './partsProvider/main.jsx'
import TransactionsList from './transactionsList/main.jsx'
import PartsRequestPanel  from '../general/requestsPanel/requestsList.jsx'
import {setItem, getSingleItemDispatch, loadGlobalConfig} from '../../../utils/api'
import {formatDate} from '../../../utils/formatDate'
import {patchWorkView} from '../general/actions'
import ReceiptPanel from '../general/receipt/receiptPanel/receiptPanel.jsx'
import Search from '../../../general/search/search.jsx'
import {productSearchDoubleClick} from './partsProvider/actions.js'
import WorkshopTotal from './total/main.jsx'



@connect((store)=>{
    return{
        work_order: store.workshopview.work_order,

        partsRequestList: store.transactionsList.partsRequestList,
        partsRequestToDelete: store.transactionsList.partsRequestToDelete,

        laborList: store.transactionsList.laborList,
        laborsToDelete: store.transactionsList.laborsToDelete,

        cashAdvanceList: store.transactionsList.cashAdvanceList,
        cashAdvancesToDelete: store.transactionsList.cashAdvancesToDelete,

        usedPartList: store.transactionsList.usedPartList,
        usedPartsToDelete: store.transactionsList.usedPartsToDelete,

        informativeList: store.transactionsList.informativeList,
        informativeListToDelete: store.transactionsList.informativeListToDelete,

        user: store.user,
        client: store.workshopview.work_order.client,
        is_closed: store.workshopview.work_order.is_closed,

        workshop_warehouse_id: store.workshopview.workshop_warehouse,
        sales_warehouse_id: store.workshopview.sales_warehouse,
        blackdecker_warehouse_id: store.workshopview.blackdecker_warehouse,
        is_stock_warranty: store.workshopview.is_stock_warranty,
    }
})

export default class WorkshopView extends React.Component {

    saveOrderTransactionsOrPrint(kwargs){

        let close_order = false
        if(kwargs.close_order){
            close_order = kwargs['close_order']
        }

        let no_repair = false
        if(kwargs.no_repair){
            no_repair = kwargs['no_repair']
        }

        const wo = this.props.work_order

        //check if the order is already closed, if so, print
        if(!wo.is_closed){
            //check if the order has at least a mo or in movement before letting it be closed
            if(this.props.laborList.length < 1 && this.props.informativeList.length <1 && close_order){
                this.props.dispatch({type:'CANT_CLOSE_WITHOUT_MOVES'})
                return
            }
            let data = {
                client_id: this.props.client.id,
                cash_advance_list: JSON.stringify(this.props.cashAdvanceList),
                cash_advances_to_delete: JSON.stringify(this.props.cashAdvancesToDelete),
                
                labor_list: JSON.stringify(this.props.laborList),
                labor_list_to_delete: JSON.stringify(this.props.laborsToDelete),
    
                used_list: JSON.stringify(this.props.usedPartList),
                used_list_to_delete: JSON.stringify(this.props.usedPartsToDelete),
    
                parts_request_list: JSON.stringify(this.props.partsRequestList),
                parts_request_to_delete: JSON.stringify(this.props.partsRequestToDelete),

                informative_list: JSON.stringify(this.props.informativeList),
                informative_list_to_delete: JSON.stringify(this.props.informativeListToDelete),
    
                main_warehouse_id: this.props.sales_warehouse_id,
                workshop_warehouse_id: this.props.workshop_warehouse_id,
                black_decker_warehouse: this.props.blackdecker_warehouse_id,
    
                close_order: close_order,
                no_repair: no_repair,
            }
            
            console.log("Dispatched data --> ", data)
            const saveKwargs = {
                work_order_id: this.props.work_order.id,
                data: data,
                dispatcher: this.props.dispatch
            }
            if(kwargs.user_id){
                saveKwargs.data['user_id'] = kwargs.user_id
            }
            patchWorkView(saveKwargs)
            return
    
        }

        //print the order closed receipt
        const is_bd_warranty = wo.warranty_number_bd.length > 0?true:false
        if(wo.is_warranty && !wo.close_no_repair){
            if(is_bd_warranty){
                this.props.dispatch({type:'SET_RECEIPT_TO_PRINT', payload: 'bd_warranty'})
                this.props.dispatch({type:'SHOW_RECEIPT_PANEL'})
            }else{
                this.props.dispatch({type:'SET_RECEIPT_TO_PRINT', payload: 'internal_warranty'})
                this.props.dispatch({type:'SHOW_RECEIPT_PANEL'})
            }
        }


    }

    componentWillUpdate(nextProps){
        if(nextProps.work_order.id !=='000000' && this.props.work_order.id ==='000000'){

            const kwargs = {
                url: `/api/listworkorders/${nextProps.work_order.id}/`,
                successType: 'SET_WORK_ORDER_VIEW',
                errorType: 'WORK_ORDER_NOT_FOUND',
                lookUpName: 'consecutivo orden',
                modelName: 'Orden de trabajo'
            }
    
            this.props.dispatch({type:'FETCHING_STARTED', payload:''})
            //load work order
            this.props.dispatch(getSingleItemDispatch(kwargs))

        }
    }

    requestPatchPin(close_order, no_repair){

        const kwargs = {

        }
        if(close_order!==undefined){
            kwargs['close_order']=close_order
        }
        if(no_repair!==undefined){
            kwargs['no_repair']=no_repair
        }
        this.props.dispatch({type: 'SET_PIN_CASE_AND_SHOW', 
        payload: {case: 'workorderview_update', kwargs: kwargs}})
    }
    componentWillMount(){
        
        const _this = this
        const method = function(kwargs){
            return _this.saveOrderTransactionsOrPrint(kwargs)
        }

        this.props.dispatch({type:'CLEAR_PIN_CASES'})

        this.props.dispatch({type:'CLEAR_WORKSHOPVIEW'})

        //register the path action with the PIN panel
        const pinCase = {
            case_name: 'workorderview_update',
            headerText: 'Actualizar Orden de Trabajo',
            actionDescription: 'Actualizar orden de trabajo existente?',
            dispatchButtonText: 'Actualizar',
            method: method,
            actionHeader: 'Actualizar Orden',
            actionDescription: 'Al actualizar la orden de trabajo el usuario queda asociado como responsable. Revise la consistencia de la información',
            insert_user: true
        }
        this.props.dispatch({type:'REGISTER_ACTION_CASE', payload: pinCase})

        this.props.dispatch(loadGlobalConfig('inventory', 'sales_warehouse', 'FETCH_SALES_WAREHOUSE_FULFILLED', 'FETCH_SALES_WAREHOUSE_REJECTED'))
        this.props.dispatch(loadGlobalConfig('inventory', 'workshop_warehouse', 'FETCH_WORKSHOP_WAREHOUSE_FULFILLED', 'FETCH_WORKSHOP_WAREHOUSE_REJECTED'))
        
        this.props.dispatch({type:'CLEAR_WORKSHOPVIEW'})

        const work_order_consecutive = this.props.location.pathname.split('/').pop()
        this.props.dispatch({type: 'CLEAR_GLOBAL_CONFIG'})
        const kwargs = {
            lookUpField: 'consecutive',
            url: '/api/listworkorders/',
            lookUpValue: work_order_consecutive,
            dispatchType: 'SET_WORK_ORDER_VIEW_SIMPLE',
            dispatchErrorType: 'WORK_ORDER_NOT_FOUND',
            lookUpName: 'consecutivo orden',
            modelName: 'Orden de trabajo'
        }

        this.props.dispatch({type:'FETCHING_STARTED'})
        //load work order
        this.props.dispatch(setItem(kwargs))
        //load preferences
        this.props.dispatch(loadGlobalConfig('inventory', 'workshop_warehouse', 
            'SET_WORKSHOP_WAREHOUSE', 'CLEAR_WORKSHOP_WAREHOUSE'))

        this.props.dispatch(loadGlobalConfig('inventory', 'sales_warehouse', 
            'SET_SALES_WAREHOUSE', 'CLEAR_SALES_WAREHOUSE'))

        this.props.dispatch(loadGlobalConfig('inventory', 'blackdecker_warehouse', 
            'SET_BLACKDECKER_WAREHOUSE', 'CLEAR_BLACKDECKER_WAREHOUSE'))

    }

    showRequestPanel(){
        this.props.dispatch({type: 'SHOW_REQUESTS_PANEL'})
    }
    render(){
        const work_order_info = this.buildWorkOrderHeader()
        const bd_warranty_data = this.buildBDWarrantyData()
        const client_info = this.buildClientInfo()
        const article_info = this.buildArticleInfo()

        const footer =  this.buildFooter()

        const data_to_bind = {sales_warehouse: this.props.sales_warehouse_id, parts_requests: this.props.partsRequestList}

        return <div className="workshop-view" >
            <PartsRequestPanel/>
            <Search modelText='Productos' model='product' namespace='productSearch' onRowDoubleClick={productSearchDoubleClick.bind(data_to_bind)}/>
            <div className="workshop-view-left" >
                <div className="workshop-view-left-header" >
                    <div className="workshop-view-left-header-partsProvider">
                        <PartsProvider/>
                    </div>
                    <div className="workshop-view-left-transactions">
                        <TransactionsList/>
                    </div>
                    <div className="workshop-view-left-total">
                        <WorkshopTotal/>
                    </div>

                </div>
                <div className="workshop-view-left-body" >

                </div>
            </div>

            <div className="workshop-view-right" >
                {work_order_info}
                {bd_warranty_data}
                {client_info}
                {article_info}
            </div>
            
            <div className="workshop-view-footer">
                {footer}
            </div>

            <ReceiptPanel/>


        </div>
    }

    printReceipt(e){
        this.props.dispatch({type:'SET_RECEIPT_TO_PRINT', payload: 'reception_receipt'})
        this.props.dispatch({type:'SHOW_RECEIPT_PANEL'})
    }

    closeNoRepairReceiptOrPrint(){
        if(!this.props.work_order.closed_no_repair && !this.props.work_order.is_closed){
            if(this.props.partsRequestList.length>0 || this.props.partsRequestToDelete.length>0){
                this.props.dispatch({type: 'CANT_CLOSE_NO_REPAIR_WITH_PARTS_REQUEST'})
                return
            }

            if(this.props.laborList.length < 1 && this.props.informativeList.length <1){
                this.props.dispatch({type:'CANT_CLOSE_WITHOUT_MOVES_NO_REPAIR'})
                return
            }
            this.requestPatchPin(true, true, null)
            //do the closing process

        }else{
            this.props.dispatch({type:'SET_RECEIPT_TO_PRINT', payload: 'no_reapair'})
            this.props.dispatch({type:'SHOW_RECEIPT_PANEL'})

        }
    }

    buildFooter(){
        //show the save movements button only for open orders
        const wo = this.props.work_order


        const save_movements_button = this.props.work_order.is_closed 
        ?''
        :<div className="workshop-view-footer-buttons">
            <button className="form-control btn-success workshop-view-footer-buttons-update"
                onClick={this.requestPatchPin.bind(this, false, false)}
                disabled={this.props.is_closed}>
                Guardar Movimientos
            </button>
        </div>
        //handle save, close and print of order
        let save_close_print_text = ''
        let save_close_print_visible = true
        if(!wo.is_closed){
            save_close_print_text = 'Guardar y Cerrar Orden'
        }else if(!wo.closed_no_repair && wo.is_warranty){
            save_close_print_text = 'Imprimir Cierre'
        }else{
            save_close_print_visible = false
        }
        let save_close_print  = ''
        if(save_close_print_visible){
            save_close_print = <div className="workshop-view-footer-buttons">
                <button className="form-control btn-success workshop-view-footer-buttons-update-close"
                    onClick={this.requestPatchPin.bind(this, true, false)}>
                    {save_close_print_text}
                </button>
                </div>
        }

        //handle close no repair button
        let close_no_repair_text = ''
        let close_no_repair_visible = true
        if(!wo.is_closed){
            close_no_repair_text = 'Cerrar Sin Reparación'
        }else if(wo.closed_no_repair){
            close_no_repair_text = 'Imprimir Cierre sin Reparación'
        }else{
            close_no_repair_visible = false
        }

        let close_no_repair = ''
        if(close_no_repair_visible){
            close_no_repair = <div className="workshop-view-footer-buttons">
                <button className="form-control btn-success workshop-view-footer-buttons-cancel"
                onClick={this.closeNoRepairReceiptOrPrint.bind(this)}>
                    {close_no_repair_text}
                </button>
            </div>
        }

        const footer = <div className="workshop-view-footer-buttons">
            {save_movements_button}
            {save_close_print}
            {close_no_repair}

            <div className="workshop-view-footer-buttons">
                <button className="form-control btn-success workshop-view-footer-buttons-cancel"
                onClick={this.printReceipt.bind(this)}>
                    Recibo de Ingreso
                </button>
            </div>
            <div className="workshop-view-footer-buttons">
                <button className="form-control btn-success workshop-view-footer-buttons-cancel"
                onClick={this.showRequestPanel.bind(this)}>
                    Mostrar Requisiciones
                </button>
            </div>
        </div>

        return footer

    }

    buildArticleInfo(){
        let article_brand = ''
        const wo = this.props.work_order

        if(wo.article_brand !== ''){
            article_brand = <div className="workshop-view-right-article-prop">
                <h3 className="workshop-view-right-article-label">Marca: </h3>
                <span className="workshop-view-right-article-data">{wo.article_brand}</span>
            </div>
        }
        let article_color = ''
        if(wo.article_color !== ''){
            article_color = <div className="workshop-view-right-article-prop">
                <h3 className="workshop-view-right-article-label">Color: </h3>
                <span className="workshop-view-right-article-data">{wo.article_color}</span>
            </div>
        }
        let article_model = ''
        if(wo.article_model !== ''){
            article_model= <div className="workshop-view-right-article-prop">
                <h3 className="workshop-view-right-article-label">Modelo: </h3>
                <span className="workshop-view-right-article-data">{wo.article_model}</span>
            </div>
        }
        let article_serial = ''
        if(wo.article_serial !== ''){
            article_serial = <div className="workshop-view-right-article-prop">
                <h3 className="workshop-view-right-article-label">Serie: </h3>
                <span className="workshop-view-right-article-data">{wo.article_serial}</span>
            </div>
        }
        let article_type = ''
        if(wo.article_type !== ''){
            article_type = <div className="workshop-view-right-article-prop">
                <h3 className="workshop-view-right-article-label">Tipo: </h3>
                <span className="workshop-view-right-article-data">{wo.article_type}</span>
            </div>
        }
        let observations_list = ''
        if(wo.observations_list !== '' && wo.observations_list !== undefined){
            const observation_items = wo.observations_list.map((obs, index)=>
                <li key={obs.key} className="workshop-view-right-article-observations-list-item" >
                {obs.value}
                </li>
            ) 
            observations_list = <div className="workshop-view-right-article-observations">
                <h3 className="workshop-view-right-article-label">Lista observaciones: </h3>
                <ul className="workshop-view-right-article-observations-list">
                    {observation_items}
                </ul>
            </div>
        }

        let article_malfunctions = ''

        if(wo.malfunction_details !== '' && wo.malfunction_details !== undefined){
            const malfunctions = wo.malfunction_details.map((malfunction, index)=>
            <li key={malfunction.key} className="workshop-view-right-article-malfunctions-list-item">
                {malfunction.value}
            </li>
            )

            article_malfunctions = <div className="workshop-view-right-article-malfunctions">
                <h3 className="workshop-view-right-article-label" >Lista de fallas:</h3>
                <ul className="workshop-view-right-article-malfunctions-list">
                    {malfunctions}
                </ul>               
            </div>
        }
        
        return <div className="workshop-view-right-article">
            <h1 className="workshop-view-right-article-section">Detalles del artículo</h1>
            {article_brand}
            {article_color}
            {article_model}
            {article_serial}
            {article_type}
            {observations_list}
            {article_malfunctions}
        </div>
    }

    buildWorkOrderHeader(){
        const employee = this.props.work_order.receiving_employee
        let last_updater =  ''
        try {
            last_updater = JSON.parse(this.props.work_order.updated_by)
        } catch (error) {
            
        }

        const close_date = formatDate(this.props.work_order.close_date) !== "31/12/1969" ? formatDate(this.props.work_order.close_date) : 'Pendiente'
        let employee_name = `${employee.first_name? employee.first_name : 'Usuario'} ${employee.last_name? employee.last_name: 'Sistema'}`
        let updater_name = `${last_updater.first_name? last_updater.first_name : 'Usuario'} ${last_updater.last_name? last_updater.last_name: 'Sistema'}`

        const check_class = this.props.work_order.is_warranty ? "fa fa-check-square": "fa fa-square"
        return <div className="workshop-view-right-workorder" >
            <h1 className="workshop-view-right-workorder-section">Orden de trabajo</h1>
            <div className="workshop-view-right-warranty-prop">
                <h3 className="workshop-view-right-warranty-label"># orden</h3>
                <span className="workshop-view-right-warranty-data">{this.props.work_order.consecutive}</span>
            </div>

            <div className="workshop-view-right-warranty-prop">
                <h3 className="workshop-view-right-warranty-label">Fecha Creación:</h3>
                <span className="workshop-view-right-warranty-data">{formatDate(this.props.work_order.created)}</span>
            </div>
            <div className="workshop-view-right-warranty-prop">
                <h3 className="workshop-view-right-warranty-label">Fecha Cierre:</h3>
                <span className="workshop-view-right-warranty-data">{close_date}</span>
            </div>

            <div className="workshop-view-right-warranty-prop">
                <h3 className="workshop-view-right-warranty-label">Creada por:</h3>
                <span className="workshop-view-right-warranty-data">{employee_name}</span>
            </div>
            <div className="workshop-view-right-warranty-prop">
                <h3 className="workshop-view-right-warranty-label">Última Actualización:</h3>
                <span className="workshop-view-right-warranty-data">{updater_name}</span>
            </div>

            <div className="workshop-view-right-warranty-prop">
                    <h3 className="workshop-view-right-warranty-label">Es garantía: </h3>
                    <span className={check_class + " workshop-view-right-warranty-data"}></span>
            </div>

        </div>
    }

    buildBDWarrantyData(){
        
        let bd_data = ''
        const wo = this.props.work_order

        const warranty_invoice_date = this.props.is_stock_warranty?'STOCK':formatDate(wo.warranty_invoice_date)

        if(wo.warranty_number_bd !== '' && wo.warranty_number_bd !== undefined){
            bd_data = <div className="workshop-view-right-warranty">
                <h1 className="workshop-view-right-warranty-section" >Información de Garantía </h1>

                <div className="workshop-view-right-warranty-prop">
                    <h3 className="workshop-view-right-warranty-label">Número de garantía B&amp;D:</h3>
                    <span className="workshop-view-right-warranty-data">{wo.warranty_number_bd} </span>
                    <hr/>
                </div>

                <div className="workshop-view-right-warranty-prop">
                    <h3 className="workshop-view-right-warranty-label">Vendedor:</h3>
                    <span className="workshop-view-right-warranty-data">{wo.warranty_supplier_name} </span>
                    <hr/>
                </div>

                <div className="workshop-view-right-warranty-prop">
                    <h3 className="workshop-view-right-warranty-label">Número Factura:</h3>
                    <span className="workshop-view-right-warranty-data">{wo.warranty_invoice_number}</span>
                    <hr/>
                </div>

                <div className="workshop-view-right-warranty-prop">
                    <h3 className="workshop-view-right-warranty-label">Fecha venta:</h3>
                    <span className="workshop-view-right-warranty-data">{warranty_invoice_date} </span>
                </div>

            </div>
        }

        return bd_data 
    }

    buildClientInfo(){
        const client = this.props.work_order.client
        let client_name = `${client.name? client.name : 'Cliente'} ${client.last_name? client.last_name: 'Contado'}`

        return <div className="workshop-view-right-client">
            <h1 className="workshop-view-right-client-section" >Cliente</h1>

            <div className="workshop-view-right-client-prop">
                    <h3 className="workshop-view-right-client-label">Nombre:</h3>
                    <span className="workshop-view-right-client-data">{client_name}</span>
                    <hr/>
            </div>

            <div className="workshop-view-right-client-prop">
                    <span className="fa fa-phone workshop-view-right-client-label"></span>
                    <span className="workshop-view-right-client-data">{client.phone_number}</span>
                    <hr/>
            </div>

            <div className="workshop-view-right-client-prop">
                    <span className="fa fa-mobile workshop-view-right-client-label"></span>
                    <span className="workshop-view-right-client-data">{client.cellphone_number}</span>
                    <hr/>
            </div>

            <div className="workshop-view-right-client-prop">
                    <span className="fa fa-envelope workshop-view-right-client-label"></span>
                    <span className="workshop-view-right-client-data">{client.email}</span>
            </div>
        </div>
    }


}
