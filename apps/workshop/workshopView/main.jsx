import React from 'react'
import {connect} from 'react-redux'
import Client from '../general/clients/clients.jsx'
import PartsProvider from './partsProvider/main.jsx'
import TransactionsList from './transactionsList/main.jsx'
import {setItem} from '../../../utils/api'
import {formatDate} from '../../../utils/formatDate'
import {saveLaborTransactions, saveCashAdvanceTransactions, openCloseWorkOrder} from './actions'
import {loadCashAdvances, loadLaborTransactions} from '../general/actions'
import alertify from 'alertifyjs'

let inspect = require('util-inspect')


@connect((store)=>{
    return{
        work_order: store.workshopview.work_order,
        work_order_old: store.workshopview.work_order_old,

        laborList: store.transactionsList.laborList,
        laborListOld: store.transactionsList.laborListOld,

        cashAdvanceList: store.transactionsList.cashAdvanceList,
        cashAdvanceListOld: store.transactionsList.cashAdvanceListOld, 

        user: store.user,
        client: store.workshopview.work_order.client
    }
})

export default class WorkshopView extends React.Component {

    componentWillMount(){
        const work_order_consecutive = this.props.location.pathname.split('/').pop()

        const kwargs = {
            lookUpField: 'consecutive',
            url: '/api/workorders/',
            lookUpValue: work_order_consecutive,
            dispatchType: 'SET_WORK_ORDER_VIEW',
            dispatchType2: 'SET_OLD_WORK_ORDER_VIEW',
            dispatchErrorType: 'WORK_ORDER_NOT_FOUND',
            lookUpName: 'consecutivo orden',
            modelName: 'Orden de trabajo'
        }

        this.props.dispatch({type:'FETCHING_STARTED', payload:''})
        //load work order
        this.props.dispatch(setItem(kwargs))



    }

    saveOrderTransactions(){
        console.log("Save Labor")
        const labor_promises = saveLaborTransactions(this.props.work_order.id, this.props.laborList, this.props.laborListOld, this.props.user, this.props.dispatch)
        
        console.log('Save cash advance')
        const cash_promises = saveCashAdvanceTransactions(this.props.work_order.id, this.props.cashAdvanceList, this.props.cashAdvanceListOld, this.props.user, 
                                    this.props.client, this.props.dispatch)

        return new Promise((resolve, reject)=>{
            Promise.all(labor_promises.save).then((values)=>{
                if(labor_promises.save.length>0){
                    this.props.dispatch({type:'LABOR_MOVEMENTS_CREATED', payload:values})
                }
                Promise.all(labor_promises.patch).then(values=>{
                    if(labor_promises.patch.length>0){
                        this.props.dispatch({type: 'LABOR_MOVEMENTS_PATCHED', payload:values})
                    }
                    Promise.all(cash_promises.save).then((values)=>{
                        if(cash_promises.save.length>0){
                            this.props.dispatch({type:'CASH_ADVANCE_MOVEMENTS_CREATED', payload:values})
                        }
                        Promise.all(cash_promises.patch).then((values)=>{
                            if(cash_promises.patch.length>0){
                                this.props.dispatch({type:'CASH_ADVANCE_MOVEMENTS_PATCHED', payload:values})
                            }
                            resolve()
                        }).catch(err=>{
                            reject(err)
                        })
                    })
                })
            })
        })

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
            console.log('Fetch advances for ' + nextProps.work_order.id)
            loadCashAdvances(nextProps.work_order.id, this.props.dispatch)
            console.log('Fetch labor for ' + nextProps.work_order.id)
            loadLaborTransactions(nextProps.work_order.id, this.props.dispatch)
        }
    }

    render(){
        const work_order_info = this.buildWorkOrderHeader()
        const bd_warranty_data = this.buildBDWarrantyData()
        const client_info = this.buildClientInfo()
        const article_info = this.buildArticleInfo()

        const footer =  this.buildFooter()

        return <div className="workshop-view" >
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
        </div>
    }

    buildFooter(){
        const footer = <div className="workshop-view-footer-buttons">
            <div className="workshop-view-footer-buttons">
                <button className="form-control btn-success workshop-view-footer-buttons-update"
                    onClick={this.saveOrderTransactions.bind(this)}>
                    Guardar Movimientos
                </button>
            </div>
            <div className="workshop-view-footer-buttons">
                <button className="form-control btn-success workshop-view-footer-buttons-update-close"
                    onClick={this.closeOrder.bind(this)}>
                    Guardar y Cerrar Orden
                </button>
            </div>
            <div className="workshop-view-footer-buttons">
                <button className="form-control btn-danger workshop-view-footer-buttons-cancel">
                    Cancelar Movimientos Nuevos
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
