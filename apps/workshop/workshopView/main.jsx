import React from 'react'
import {connect} from 'react-redux'

import PartsProvider from './partsProvider/main.jsx'
import TransactionsList from './transactionsList/main.jsx'
import {setItem, getSingleItemDispatch} from '../../../utils/api'
import {formatDate} from '../../../utils/formatDate'
import {openCloseWorkOrder} from './actions'
import {patchWorkView} from '../general/actions'
import alertify from 'alertifyjs'
import ReceiptPanel from '../general/receipt/receiptPanel/receiptPanel.jsx'
import Search from '../../../general/search/search.jsx'



let inspect = require('util-inspect')


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

        user: store.user,
        client: store.workshopview.work_order.client,
        is_closed: store.workshopview.work_order.is_closed,
    }
})

export default class WorkshopView extends React.Component {

    componentWillMount(){
        const work_order_consecutive = this.props.location.pathname.split('/').pop()

        const kwargs = {
            lookUpField: 'consecutive',
            url: '/api/listworkorders/',
            lookUpValue: work_order_consecutive,
            dispatchType: 'SET_WORK_ORDER_VIEW_SIMPLE',
            dispatchErrorType: 'WORK_ORDER_NOT_FOUND',
            lookUpName: 'consecutivo orden',
            modelName: 'Orden de trabajo'
        }

        this.props.dispatch({type:'FETCHING_STARTED', payload:''})
        //load work order
        this.props.dispatch(setItem(kwargs))
    }

    saveOrderTransactions(close_order, e){

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

            main_warehouse_id: '9d85cecc-feb1-4710-9a19-0a187580e15e',
            workshop_warehouse_id: '4a25f16d-0f1a-4e9e-95b0-a464c085a20c',

            close_order: close_order,
        }

        const saveKwargs = {
            work_order_id: this.props.work_order.id,
            data: data,
            dispatcher: this.props.dispatch
        }

        patchWorkView(saveKwargs)

    }

    runSequence(all_tasks){
        console.log('start sequence')
        let result = Promise.resolve()
        all_tasks.forEach(task=>{
            result = result.then(()=>{
                return Promise.all(task.promises).then(result=>{
                    if(task.promises.length>0){
                        this.props.dispatch({type:task.dispatch, payload:result})
                    }
                    
                })
            })

        })

        return result

    }

    closeOrder(){
        this.saveOrderTransactions().then(()=>{
            const kwargs = {
                work_order_id: this.props.work_order.id,
                new_status: true,
                old_order: this.props.work_order_old,
                new_order : this.props.work_order,
                user: this.props.user
            }
            openCloseWorkOrder(kwargs).then(b=>{
                alertify.alert('Completado: Orden de trabajo Guardada y Cerrada!', '')
            })
        })


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

    render(){
        const work_order_info = this.buildWorkOrderHeader()
        const bd_warranty_data = this.buildBDWarrantyData()
        const client_info = this.buildClientInfo()
        const article_info = this.buildArticleInfo()

        const footer =  this.buildFooter()

        return <div className="workshop-view" >
            <Search modelText='Productos' model='product' namespace='productSearch' />
            <div className="workshop-view-left" >
                <div className="workshop-view-left-header" >
                    <div className="workshop-view-left-header-partsProvider">
                        <PartsProvider/>
                    </div>
                    <div className="workshop-view-left-transactions">
                        <TransactionsList/>
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
        this.props.dispatch({type:'SHOW_RECEIPT_PANEL'})
    }

    buildFooter(){
        const footer = <div className="workshop-view-footer-buttons">
            <div className="workshop-view-footer-buttons">
                <button className="form-control btn-success workshop-view-footer-buttons-update"
                    onClick={this.saveOrderTransactions.bind(this, false)}
                    disabled={this.props.is_closed}>
                    Guardar Movimientos
                </button>
            </div>
            <div className="workshop-view-footer-buttons">
                <button className="form-control btn-success workshop-view-footer-buttons-update-close"
                    onClick={this.saveOrderTransactions.bind(this, true)}
                    disabled={this.props.is_closed}>
                    Guardar y Cerrar Orden
                </button>
            </div>
            <div className="workshop-view-footer-buttons">
                <button className="form-control btn-success workshop-view-footer-buttons-cancel"
                onClick={this.printReceipt.bind(this)}>
                    Imprimir Recibo
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
        let employee_name = `${employee.first_name? employee.first_name : 'Usuario'} ${employee.last_name? employee.last_name: 'Sistema'}`
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
                <h3 className="workshop-view-right-warranty-label">Creada por:</h3>
                <span className="workshop-view-right-warranty-data">{employee_name}</span>
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
                    <span className="workshop-view-right-warranty-data">{formatDate(wo.warranty_invoice_date)} </span>
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
