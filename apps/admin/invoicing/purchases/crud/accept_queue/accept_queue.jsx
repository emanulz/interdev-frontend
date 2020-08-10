import React from 'react'
import {connect} from 'react-redux'
import AdminTable from '../../../../../../general/adminTable/adminTable.jsx'
import { getPaginationItemDispatch } from '../../../../../../utils/api.js'
import Select2 from 'react-select2-wrapper'
// import Pagination from '../../../../../../general/pagination/pagination.jsx'
// import ResultsPerPage from '../../../../../../general/pagination/resultsPerPage.jsx'
// import { createDeflateRaw } from 'zlib';
import { generalSave } from '../../../../../../utils/api.js'
import { getItemDispatch } from '../../../../../../utils/api.js'

@connect((store) => {
    return {
        fetching: store.fetching.fetching,
        pageSize: store.pagination.pageSize,
        searchResults: store.adminSearch.searchResults,
        accepted_queued_tasks: store.epurchases.accepted_queued_tasks,
        refetch_queued_tasks: store.epurchases.refetch_queued_tasks,
        activities: store.epurchases.activities,
        target_activity: store.epurchases.target_activity
    }
})
export default class AcceptQueue extends React.Component {

    constructor(props){
        super(props)
        this.state =  {
            purchases_mode: {}
        }
        
    }

    componentWillMount(){

        this.getInitialQueuedTasks()
        const kwargs = {
            url: '/api/taxpayerlocalsro/',
            successType: 'TAX_PAYER_LOCAL_ACTIVITIES_FULFILLED',
            errorType: 'TAX_PAYER_LOCAL_ACTIVITIES_REJECTED'
          }
        this.props.dispatch(getItemDispatch(kwargs))
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.refetch_queued_tasks && !this.props.refetch_queued_tasks){
            this.props.dispatch({type: 'RESET_REFETCH_QUEUED'})
            this.getInitialQueuedTasks()
        }
        if(nextProps.activities.length > 0 && this.props.activities.length === 0){
            this.props.dispatch({type: 'TAX_PAYER_ACTIVITY_SELECTED', payload: nextProps.activities[0].id});
        }
    }

    getInitialQueuedTasks(){
        this.props.dispatch({type: 'FETCHING_STARTED'})

        const tasksKwargs = {
            url: `/api/administration/helpertasks/?task_detail=&task_type=0&completed=False&to_delete=False`,
            successType: 'PURCHASE_RECEPTION_TASKS_FULFILLED',
            errorType: 'PURCHASE_RECEPTION_TASKS_REJECTED'
        }

        this.props.dispatch(getPaginationItemDispatch(tasksKwargs))
    }

    setPurchaseExpenseGlobal(value){
        let new_purchases_mode = {}
        for(let key of Object.keys(this.state.purchases_mode)){
            new_purchases_mode[key] = value
        }
        this.setState({
            purchases_mode: new_purchases_mode
        })
        this.forceUpdate()
        console.log(this.state.purchases_mode)
    }

    parseTasksData(tasks){
        if(!tasks){
            return []
        }
        return tasks.map(t => {
            if(this.state.purchases_mode[t.id] === undefined){
                this.state.purchases_mode[t.id] = "Compra"
            }
            const t_details = JSON.parse(t.task_detail)
            let emisor_name = t_details.emisor_name
            if(emisor_name.length>40){
                emisor_name = emisor_name.substr(0,40) + "..."
            }
            return {
                id: t.id,
                doc_path: t_details.doc_path,
                emisor_name: emisor_name,
                doc_type: t_details.doc_type,
                TotalComprobante: t_details.TotalComprobante,
                purchase_mode: this.state.purchases_mode[t.id]
            }
        })
    }

    onPurchaseModeSelected(task_id, event){

        if(event.target.value === "Compra"){
            this.state.purchases_mode[task_id] = "Compra"
        }else if(event.target.value === "Gasto"){
            this.state.purchases_mode[task_id] = "Gasto"
        }

    }

    processDocInTask(kwargs){
        
        let task_id = kwargs.task_id
        let accept_reject = kwargs.accept_reject
        if(!this.props.target_activity){
            alertify.alert('ERROR', 'Debe especificar la actividad asociada.')
            return
        }
        let request_data = [
            {
                task_id: task_id,
                accept_reject: accept_reject,
                mode: this.state.purchases_mode[task_id],
                activity: this.props.target_activity
            }
        ]
        console.log("Dam request data --> ", request_data)

        const request_kwargs = {
            url: '/api/facturareception/processAcceptQueuedTasks/',
            method: 'post',
            data: request_data,
            sucessMessage: 'Tareas procesadas correctamente. Facturas en proceso con Hacienda',
            errorMessage: 'Hubo un error al procesar las tareas.',
            successType: 'QUEUED_TASK_PROCESSED',
            errorType: 'QUEUED_TASKS_PROCESS_FAILED',
          }
       
          this.props.dispatch({type: 'FETCHING_STARTED'})
          this.props.dispatch(generalSave(request_kwargs))
    }

    processAllDocsInTask(accept_reject, e){
        // console.log("Accept reject --> ", accept_reject)
        let request_data = []
        if(!this.props.target_activity){
            alertify.alert('ERROR', 'Debe especificar la actividad asociada.')
            return
        }

        for(let task of this.props.accepted_queued_tasks){
            request_data.push({
                task_id: task.id,
                accept_reject: accept_reject,
                mode: this.state.purchases_mode[task.id],
                activity: this.props.target_activity
            })
        }

        const request_kwargs = {
            url: '/api/facturareception/processAcceptQueuedTasks/',
            method: 'post',
            data: request_data,
            sucessMessage: 'Tareas procesadas correctamente. Facturas en proceso con Hacienda',
            errorMessage: 'Hubo un error al procesar las tareas.',
            successType: 'QUEUED_TASK_PROCESSED',
            errorType: 'QUEUED_TASKS_PROCESS_FAILED',
          }
       
          this.props.dispatch({type: 'FETCHING_STARTED'})
          this.props.dispatch(generalSave(request_kwargs))

    }

    setTargetActivity(ev){
        const value = ev.target.value;
        this.props.dispatch({type: 'TAX_PAYER_ACTIVITY_SELECTED', payload: value});
    }

    render(){

        const activity_options = this.props.activities.map(
            a => {
                const name =  `${a.code}-${a.activity_name}`
                return <option value={a.id}>{name}</option>
            }
        );

        const options = [
                {text: "Compra", id: "Compra"},
                {text: "Gasto", id: "Gasto"}
            ]
        
        const Select2Builder = (value, handler, param) => {
            return <Select2
                name='purchase_mode'
                value={value}
                className='form-control'
                onSelect={handler.bind(this, param)}
                data={options}
                options={{
                placeholder: 'Elija una Modalidad...',
                noResultsText: 'Sin elementos'
                }}
            />  
        }

        const buttonBuilder = (text, class_names, click_handler, click_kwargs) => {
            return <button
                className={class_names} 
                onClick={click_handler.bind(this, click_kwargs)}
                >{text}</button>
        }

        const headerOrder = [
            {
                field: 'id',
                text: 'Consecutivo',
                type: 'text'
            },
            // {
            //     field: 'doc_path',
            //     text: 'Documento',
            //     type: 'text'
            // },
            {
                field: 'emisor_name',
                text: 'Emisor',
                type: 'text'
            },
            {
                field: 'doc_type',
                text: 'Tipo',
                type: 'text'
            },
            {
                field: 'TotalComprobante',
                text: 'Total Comprobante',
                type: 'text'
            },
            {
                field: 'id',
                text: 'Modalidad',
                type: 'select2',
                value: 'purchase_mode',
                builder: Select2Builder,
                handler: this.onPurchaseModeSelected,
                
            },
            {
                field: 'id',
                type: 'button',
                builder: buttonBuilder,
                onClick: {
                    method: this.processDocInTask,
                    method_params: [
                        {type: 'raw', name: "accept_reject",  value: true},
                        {type: 'element', name: 'task_id', key: 'id'}
                    ]
                },
                class_names: 'btn btn-primary',
                text: 'Aceptar'
            },
            {
                field: 'id',
                type: 'button',
                builder: buttonBuilder,
                onClick: {
                    method: this.processDocInTask,
                    method_params: [
                        {type: 'raw', name: "accept_reject",  value: false},
                        {type: 'element', name: 'task_id', key: 'id'}
                    ]
                },
                class_names: 'btn btn-danger',
                text: 'Rechazar'
            }
        ]


        const fetching = <div />
        const tableData = this.props.searchResults.length ? this.props.searchResults : this.parseTasksData(this.props.accepted_queued_tasks)
        

        const is_expense_button =<button onClick={this.setPurchaseExpenseGlobal.bind(this, "Gasto")}
          className='form-buttons-container-save form-control btn-accent'>
            Todos GASTOS
        </button>

        const is_purchase_button =<button onClick={this.setPurchaseExpenseGlobal.bind(this, "Compra")}
        className='form-buttons-container-save form-control btn-primary'>
            Todos COMPRAS
        </button>

        const accept_all_button =<button onClick={this.processAllDocsInTask.bind(this, true)}
            className='form-buttons-container-save form-control btn-success'>
            ACEPTAR TODOS
            </button>

        const reject_all_button =<button onClick={this.processAllDocsInTask.bind(this, false)}
            className='form-buttons-container-save form-control btn-danger'>
            RECHAZAR TODOS
            </button>
    
        const activity_selector = <div className='viewInvoice-activity'>
            <h1>Actividad económica:</h1>
            <select onChange={this.setTargetActivity.bind(this)} className='form-control'
            value={this.props.target_activity} >
            {activity_options}
            </select>
        </div>

        const table = <AdminTable headerOrder={headerOrder} model="taskhelpers" data={tableData} idField='id'/>

        const content = this.props.fetching ? fetching : table

        return <div className='list list-container'>
            <div className='admin-list-header'>
                <h1>Listado de Compras por Aceptar:</h1>
            </div>
            <div className='admin-list-header'>
                <p>El botón Todos Gastos ajusta todas los documentos pendientes como Gastos tributarios,
                    mientras que el botón Todos Compras configura los ajusta como Compras tributarias.
                </p>
                {is_expense_button}
                {is_purchase_button}
            </div>
            <div>
                {accept_all_button}
                {reject_all_button}
            </div>
            <div>{activity_selector}</div>
            {content}
        </div>
    }



}